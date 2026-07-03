;;; ua4k.el --- Play UA4K puzzle games -*- lexical-binding: t; -*-

;; Copyright (C) 2026  Paul D. Nelson

;; Author: Paul D. Nelson <nelson.paul.david@gmail.com>
;; Version: 0.1
;; URL: https://github.com/ultronozm/ua4k
;; Package-Requires: ((emacs "28.1"))
;; Keywords: games

;; This program is free software; you can redistribute it and/or modify
;; it under the terms of the GNU General Public License as published by
;; the Free Software Foundation, either version 3 of the License, or
;; (at your option) any later version.

;; This program is distributed in the hope that it will be useful,
;; but WITHOUT ANY WARRANTY; without even the implied warranty of
;; MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
;; GNU General Public License for more details.

;; You should have received a copy of the GNU General Public License
;; along with this program.  If not, see <https://www.gnu.org/licenses/>.

;;; Commentary:

;; Play compiled UA4K games inside Emacs.
;;
;; Entry points:
;;   M-x ua4k-play-file
;;   M-x ua4k-play-game
;;   M-x ua4k-play-asset-file
;;
;; This frontend intentionally targets non-tick games first. It interprets the
;; same compiled JSON IR used by the browser runtime, so it does not need a
;; second DSL parser in Elisp.

;;; Code:

(require 'cl-lib)
(require 'json)
(require 'subr-x)

(cl-defstruct ua4k-pattern
  rows
  height
  width
  cells)

(defgroup ua4k nil
  "Play UA4K games in Emacs."
  :group 'games)

(defcustom ua4k-python-command "python3"
  "Python executable used to compile game files into JSON."
  :type 'string)

(defcustom ua4k-asset-directory nil
  "Directory containing precompiled Emacs UA4K assets.
When non-nil, `ua4k-play-asset' loads game data from this directory."
  :type '(choice (const :tag "Unset" nil) directory))

(defconst ua4k--source-file
  (or load-file-name buffer-file-name)
  "Absolute path to the loaded `ua4k.el' source file.")

(defvar-local ua4k--game-data nil)
(defvar-local ua4k--levels nil)
(defvar-local ua4k--rules nil)
(defvar-local ua4k--binds nil)
(defvar-local ua4k--goals nil)
(defvar-local ua4k--voids nil)
(defvar-local ua4k--char-map nil)
(defvar-local ua4k--color-map nil)
(defvar-local ua4k--whitespace-chars nil)
(defvar-local ua4k--hidden-line-chars nil)
(defvar-local ua4k--board nil)
(defvar-local ua4k--board-history nil)
(defvar-local ua4k--level-number 0)
(defvar-local ua4k--game-file nil)
(defvar-local ua4k--source-kind 'file)
(defvar-local ua4k--last-row -1)
(defvar-local ua4k--last-col -1)
(defvar-local ua4k--header-start nil)
(defvar-local ua4k--header-end nil)
(defvar-local ua4k--board-start nil)
(defvar-local ua4k--board-end nil)
(defvar-local ua4k--status-start nil)
(defvar-local ua4k--status-end nil)

(defun ua4k--repo-root ()
  "Return the repository root for the current `ua4k.el' file."
  (let ((source-dir (file-name-directory (or ua4k--source-file default-directory))))
    (if (string= (file-name-nondirectory (directory-file-name source-dir)) "emacs")
        (file-name-directory (directory-file-name source-dir))
      source-dir)))

(defun ua4k--compile-json (game-file)
  "Compile GAME-FILE into compiled JSON and return it as an alist."
  (with-temp-buffer
    (let* ((default-directory (ua4k--repo-root))
           (script (expand-file-name "compile-game-json.py" default-directory))
           (status (call-process ua4k-python-command nil (current-buffer) nil
                                 script game-file)))
      (unless (zerop status)
        (error "ua4k compile failed:\n%s" (string-trim (buffer-string)))))
    (goto-char (point-min))
    (json-parse-buffer :object-type 'alist :array-type 'list :null-object nil :false-object nil)))

(defun ua4k--obj-get (object key)
  "Return KEY from OBJECT, accepting either string or symbol keys."
  (when object
    (or (alist-get key object nil nil #'equal)
        (and (stringp key) (alist-get (intern key) object nil nil #'eq))
        (and (symbolp key) (alist-get (symbol-name key) object nil nil #'equal)))))

(defun ua4k--obj-cell (object key)
  "Return the cons cell for KEY in OBJECT, accepting string or symbol keys."
  (when object
    (or (assoc key object)
        (and (stringp key) (assq (intern key) object))
        (and (symbolp key) (assoc (symbol-name key) object)))))

(defun ua4k--game-file-prompt-default ()
  "Return a sensible default game file for interactive commands."
  (or (and (boundp 'ua4k--game-file) ua4k--game-file)
      (expand-file-name "games/polished/dockstep.txt" (ua4k--repo-root))))

(defun ua4k--asset-variable-symbol (game-name)
  "Return the variable symbol for compiled GAME-NAME data."
  (intern (format "ua4k_data_%s" (replace-regexp-in-string "-" "_" game-name))))

(defun ua4k--asset-feature-symbol (game-name)
  "Return the feature symbol provided by GAME-NAME's asset file."
  (intern (format "ua4k-data-%s" game-name)))

(defun ua4k--string-list->board (rows)
  "Convert ROWS (a list of strings) into a board vector.
Rows are treated as immutable: writers replace a row with a copy
before changing it (see `ua4k--apply-rule-at'), so the strings may
be shared with the compiled game data and with snapshots."
  (vconcat rows))

(defun ua4k--normalize-pattern (rows)
  "Convert ROWS into a compiled `ua4k-pattern'."
  (if (ua4k-pattern-p rows)
      rows
    (let* ((rows-vec (if (vectorp rows) rows (vconcat rows)))
           (height (length rows-vec))
           (width (if (> height 0) (length (aref rows-vec 0)) 0))
           (cells nil))
      (dotimes (i height)
        (let ((row (aref rows-vec i)))
          (dotimes (j width)
            (let ((cell (aref row j)))
              (unless (eq cell ?\?)
                (push (vector i j cell) cells))))))
      (make-ua4k-pattern
       :rows rows-vec
       :height height
       :width width
       :cells (vconcat (nreverse cells))))))

(defun ua4k--normalize-rule (rule)
  "Normalize RULE patterns for faster runtime access."
  (when rule
    (let ((from-cell (ua4k--obj-cell rule "from"))
          (to-cell (ua4k--obj-cell rule "to"))
          (rules-cell (ua4k--obj-cell rule "rules")))
      (when from-cell
        (setcdr from-cell (ua4k--normalize-pattern (cdr from-cell))))
      (when to-cell
        (setcdr to-cell (ua4k--normalize-pattern (cdr to-cell))))
      (when rules-cell
        (setcdr rules-cell (mapcar #'ua4k--normalize-rule (cdr rules-cell)))))
    rule))

(defun ua4k--normalize-compiled-data (data)
  "Normalize compiled DATA into faster runtime structures."
  (dolist (pair (ua4k--obj-get data "rules"))
    (setcdr pair (ua4k--normalize-rule (cdr pair))))
  (setcdr (ua4k--obj-cell data "goals")
          (mapcar #'ua4k--normalize-pattern (ua4k--obj-get data "goals")))
  (setcdr (ua4k--obj-cell data "voids")
          (mapcar #'ua4k--normalize-pattern (ua4k--obj-get data "voids")))
  (dolist (level (ua4k--obj-get data "levels"))
    (dolist (key '("goals" "voids"))
      (let ((cell (ua4k--obj-cell level key)))
        (when cell
          (setcdr cell (mapcar #'ua4k--normalize-pattern (cdr cell)))))))
  data)

(defun ua4k--board-copy (board)
  "Snapshot BOARD.
Rows are immutable strings, so a shallow copy of the row vector is a
complete snapshot."
  (copy-sequence board))

(defun ua4k--board-height ()
  (length ua4k--board))

(defun ua4k--board-row-width (row)
  "Return the width of board ROW."
  (length (aref ua4k--board row)))

(defun ua4k--board-width ()
  "Return the maximum row width of the current board."
  (let ((max-width 0))
    (dotimes (row (ua4k--board-height) max-width)
      (setq max-width (max max-width (ua4k--board-row-width row))))))

(defun ua4k--board-rows ()
  "Render the current board into a list of strings."
  (mapcar #'concat (append ua4k--board nil)))

(defun ua4k--pattern-height (pattern)
  (if (ua4k-pattern-p pattern)
      (ua4k-pattern-height pattern)
    (length pattern)))

(defun ua4k--pattern-width (pattern)
  (if (ua4k-pattern-p pattern)
      (ua4k-pattern-width pattern)
    (if pattern (length (car pattern)) 0)))

(defun ua4k--pattern-char (pattern row col)
  (if (ua4k-pattern-p pattern)
      (aref (aref (ua4k-pattern-rows pattern) row) col)
    (aref (nth row pattern) col)))

(defun ua4k--pattern-match (pattern row col)
  "Return non-nil if PATTERN matches the current board at ROW/COL."
  (let ((height (ua4k--pattern-height pattern))
        (width (ua4k--pattern-width pattern)))
    (when (and (>= row 0)
               (>= col 0)
               (<= (+ row height) (ua4k--board-height))
               (cl-loop for i from 0 below height
                        always (<= (+ col width)
                                   (ua4k--board-row-width (+ row i)))))
      (let ((cells (if (ua4k-pattern-p pattern)
                       (ua4k-pattern-cells pattern)
                     nil)))
        (if cells
            (catch 'ua4k-mismatch
              (dotimes (idx (length cells) t)
                (let* ((cell (aref cells idx))
                       (i (aref cell 0))
                       (j (aref cell 1))
                       (value (aref cell 2)))
                  (unless (eq value (aref (aref ua4k--board (+ row i)) (+ col j)))
                    (throw 'ua4k-mismatch nil)))))
          (cl-loop for i from 0 below height
                   always
                   (cl-loop for j from 0 below width
                            always
                            (let ((cell (ua4k--pattern-char pattern i j))
                                  (board-cell (aref (aref ua4k--board (+ row i)) (+ col j))))
                              (or (eq cell ?\?)
                                  (eq cell board-cell))))))))))

(defun ua4k--pattern-occurs (pattern)
  "Return non-nil if PATTERN occurs anywhere on the current board."
  (let ((pattern-height (ua4k--pattern-height pattern))
        (pattern-width (ua4k--pattern-width pattern))
        (board-height (ua4k--board-height)))
    (cl-loop for row from 0 to (- board-height pattern-height)
           thereis
           (let ((max-col (- (ua4k--board-row-width row) pattern-width)))
             (and (>= max-col 0)
                  (cl-loop for col from 0 to max-col
                           thereis (ua4k--pattern-match pattern row col)))))))

(defun ua4k--active-goals ()
  "Goals for the current level: its own GOAL blocks, else the game's."
  (or (ua4k--obj-get (ua4k--current-level) "goals") ua4k--goals))

(defun ua4k--active-voids ()
  "Voids for the current level: its own VOID blocks, else the game's."
  (or (ua4k--obj-get (ua4k--current-level) "voids") ua4k--voids))

(defun ua4k--level-complete-p ()
  "Return non-nil if goals are satisfied and voids are absent."
  (and
   (cl-every #'ua4k--pattern-occurs (ua4k--active-goals))
   (cl-every (lambda (void-pattern) (not (ua4k--pattern-occurs void-pattern))) (ua4k--active-voids))))

(defun ua4k--rule-type (rule)
  (ua4k--obj-get rule "type"))

(defun ua4k--rule-field (rule key)
  (ua4k--obj-get rule key))

(defun ua4k--write-cell (board-row col value copied-rows)
  "Write VALUE at COL of BOARD-ROW, copying the row first if needed.
COPIED-ROWS is a list of row indices already made private during the
current rule application. Returns the updated COPIED-ROWS."
  (unless (memq board-row copied-rows)
    (aset ua4k--board board-row (copy-sequence (aref ua4k--board board-row)))
    (push board-row copied-rows))
  (aset (aref ua4k--board board-row) col value)
  copied-rows)

(cl-defun ua4k--apply-rule-at (rule row col)
  "Apply simple RULE at ROW/COL."
  (let* ((to-pattern (ua4k--rule-field rule "to"))
         (side-effects (ua4k--rule-field rule "side_effects"))
         (needs-rollback (cl-some (lambda (side-effect)
                                    (string-suffix-p "!" side-effect))
                                  side-effects))
         (snapshot (and needs-rollback (ua4k--board-copy ua4k--board)))
         (copied-rows nil))
    (if (ua4k-pattern-p to-pattern)
        (let ((cells (ua4k-pattern-cells to-pattern)))
          (dotimes (idx (length cells))
            (let* ((cell (aref cells idx))
                   (i (aref cell 0))
                   (j (aref cell 1))
                   (value (aref cell 2)))
              (setq copied-rows
                    (ua4k--write-cell (+ row i) (+ col j) value copied-rows)))))
      (let ((height (ua4k--pattern-height to-pattern))
            (width (ua4k--pattern-width to-pattern)))
        (dotimes (i height)
          (dotimes (j width)
            (let ((cell (ua4k--pattern-char to-pattern i j)))
              (unless (eq cell ?\?)
                (setq copied-rows
                      (ua4k--write-cell (+ row i) (+ col j) cell copied-rows))))))))
    (dolist (side-effect side-effects)
      (if (string-suffix-p "!" side-effect)
          (let ((name (substring side-effect 0 -1)))
            (unless (ua4k--apply-rule (ua4k--obj-get ua4k--rules name))
              (when snapshot
                (setq ua4k--board snapshot))
              (cl-return-from ua4k--apply-rule-at nil)))
        (ua4k--apply-rule (ua4k--obj-get ua4k--rules side-effect))))
    t))

(defun ua4k--apply-simple-rule (rule &optional min-row min-col)
  "Apply simple RULE searching from MIN-ROW / MIN-COL."
  (let* ((min-row (or min-row 0))
         (min-col (or min-col 0))
         (height (ua4k--board-height))
         (method (ua4k--rule-field rule "method"))
         (from-pattern (ua4k--rule-field rule "from"))
         (pattern-width (ua4k--pattern-width from-pattern)))
    (cond
     ((string= method "random")
      (let (matches)
        (cl-loop for row from min-row below height do
                 (let ((max-col (- (ua4k--board-row-width row) pattern-width)))
                   (when (>= max-col min-col)
                     (cl-loop for col from min-col to max-col do
                              (when (ua4k--pattern-match from-pattern row col)
                                (push (cons row col) matches))))))
        (when matches
          (let* ((match (nth (random (length matches)) matches))
                 (row (car match))
                 (col (cdr match)))
            (setq ua4k--last-row row
                  ua4k--last-col col)
            (ua4k--apply-rule-at rule row col)))))
     ((string= method "lastmatch")
      (catch 'ua4k-found
        (cl-loop for row downfrom (1- height) to min-row do
                 (let ((max-col (- (ua4k--board-row-width row) pattern-width)))
                   (when (>= max-col min-col)
                     (cl-loop for col downfrom max-col to min-col do
                              (when (ua4k--pattern-match from-pattern row col)
                                (setq ua4k--last-row row
                                      ua4k--last-col col)
                                (throw 'ua4k-found (ua4k--apply-rule-at rule row col)))))))
        nil))
     (t
      (let* ((anchor (and (> pattern-width 0)
                          (> (ua4k--pattern-height from-pattern) 0)
                          (ua4k--pattern-char from-pattern 0 0)))
             (anchor-string (and anchor (not (eq anchor ?\?))
                                 (char-to-string anchor))))
        (catch 'ua4k-found
          (cl-loop for row from min-row below height do
                   (let ((max-col (- (ua4k--board-row-width row) pattern-width)))
                     (when (>= max-col min-col)
                       (if anchor-string
                           ;; Jump between anchor-character candidates with the
                           ;; native string search instead of visiting every cell.
                           (let ((board-row (aref ua4k--board row))
                                 (col min-col))
                             (while (and (setq col (string-search anchor-string board-row col))
                                         (<= col max-col))
                               (when (ua4k--pattern-match from-pattern row col)
                                 (setq ua4k--last-row row
                                       ua4k--last-col col)
                                 (throw 'ua4k-found (ua4k--apply-rule-at rule row col)))
                               (setq col (1+ col))))
                         (cl-loop for col from min-col to max-col do
                                  (when (ua4k--pattern-match from-pattern row col)
                                    (setq ua4k--last-row row
                                          ua4k--last-col col)
                                    (throw 'ua4k-found (ua4k--apply-rule-at rule row col))))))))
          nil))))))

(defun ua4k--apply-atomic-rule (rule)
  "Apply atomic RULE."
  (let ((snapshot (ua4k--board-copy ua4k--board))
        (rules (ua4k--rule-field rule "rules"))
        (condition (ua4k--rule-field rule "condition"))
        (min-row 0)
        (min-col 0)
        (ok t))
    (catch 'ua4k-atomic-fail
      (dolist (child rules)
        (unless (ua4k--apply-rule child min-row min-col)
          (setq ok nil)
          (throw 'ua4k-atomic-fail nil))
        (cond
         ((string= condition "vertical")
          (setq min-row (1+ ua4k--last-row)))
         ((string= condition "horizontal")
          (setq min-col (1+ ua4k--last-col))))))
    (unless ok
      (setq ua4k--board snapshot))
    ok))

(defun ua4k--boards-equal-p (a b)
  "Return non-nil if boards A and B have identical contents.
Rows are replaced on write, so unchanged rows keep their identity."
  (and (= (length a) (length b))
       (catch 'ua4k-boards-differ
         (dotimes (i (length a) t)
           (let ((row-a (aref a i))
                 (row-b (aref b i)))
             (unless (or (eq row-a row-b) (string= row-a row-b))
               (throw 'ua4k-boards-differ nil)))))))

(defun ua4k--apply-repeat-rule (rule)
  "Apply REPEAT RULE: like match1, repeatedly.
Try the children in order; when one succeeds, start over from the
first child. Stop when no child succeeds, or the successful child made
no progress (guards against non-terminating loops of test rules).
Always succeeds."
  (let ((children (ua4k--rule-field rule "rules"))
        (looping t))
    (while looping
      (let ((before (ua4k--board-copy ua4k--board)))
        (unless (and (cl-some #'ua4k--apply-rule children)
                     (not (ua4k--boards-equal-p ua4k--board before)))
          (setq looping nil))))
    t))

(defun ua4k--apply-rule (rule &optional min-row min-col)
  "Apply compiled RULE."
  (when rule
    (pcase (ua4k--rule-type rule)
      ("simple" (ua4k--apply-simple-rule rule min-row min-col))
      ("repeat" (ua4k--apply-repeat-rule rule))
      ("call" (ua4k--apply-rule (ua4k--obj-get ua4k--rules (ua4k--rule-field rule "name"))))
      ("match1"
       (cl-some #'ua4k--apply-rule (ua4k--rule-field rule "rules")))
      ("try_all"
       (dolist (child (ua4k--rule-field rule "rules"))
         (ua4k--apply-rule child))
       t)
      ("random"
       (let* ((rules (ua4k--rule-field rule "rules"))
              (child (nth (random (length rules)) rules)))
         (ua4k--apply-rule child)))
      ("atomic" (ua4k--apply-atomic-rule rule))
      (_ (error "Unsupported ua4k rule type in Emacs frontend: %s" (ua4k--rule-type rule))))))

(defun ua4k--bind-command (entry)
  (cond
   ((stringp entry) entry)
   ((listp entry) (ua4k--rule-field entry "command"))
   (t nil)))

(defun ua4k--bind-description (entry)
  (cond
   ((stringp entry) entry)
   ((listp entry)
    (or (ua4k--rule-field entry "description")
        (ua4k--rule-field entry "command")
        ""))
   (t "")))

(defun ua4k--current-level ()
  (nth ua4k--level-number ua4k--levels))

(defun ua4k--display-text (char)
  "Return the display text for board CHAR."
  (let ((text (or (ua4k--obj-get ua4k--char-map (char-to-string char))
                  (char-to-string char))))
    (if (member (char-to-string char) ua4k--whitespace-chars)
        " "
      text)))

(defun ua4k--board-string ()
  "Return the rendered board as a string with text properties."
  (let ((board ua4k--board)
        (char-map ua4k--char-map)
        (color-map ua4k--color-map)
        (whitespace-chars ua4k--whitespace-chars)
        (hidden-line-chars ua4k--hidden-line-chars))
    (with-temp-buffer
      (dotimes (row-idx (length board))
        (let ((row (aref board row-idx))
              (hidden nil))
          (dotimes (idx (length row))
            (let* ((cell (aref row idx))
                   (cell-text (char-to-string cell)))
              (when (member cell-text hidden-line-chars)
                (setq hidden t))
              (unless hidden
                (let* ((display (or (ua4k--obj-get char-map cell-text) cell-text))
                       (display (if (member cell-text whitespace-chars) " " display))
                       (color (ua4k--obj-get color-map cell-text)))
                  (insert
                   (if color
                       (propertize display 'face `(:foreground ,color))
                     display))))))
          (unless hidden
            (insert "\n"))))
      (insert "\n")
      (buffer-string))))

(defun ua4k--level-label ()
  "Return the level label shown in the header."
  (if (= (length ua4k--levels) 1)
      "Snippet"
    (format "Level %d/%d" ua4k--level-number (1- (length ua4k--levels)))))

(defun ua4k--header-string ()
  "Return the dynamic header string."
  (format "%s  %s  Moves: %d\n"
          (file-name-base (or ua4k--game-file "ua4k"))
          (ua4k--level-label)
          (length ua4k--board-history)))

(defun ua4k--status-string ()
  "Return the dynamic completion-status string."
  (if (ua4k--level-complete-p)
      "Level complete. Press any movement key to advance.\n\n"
    "\n"))

(defun ua4k--make-region-markers ()
  "Return a start/end marker pair for inserted text at point."
  (let ((start (copy-marker (point) nil)))
    (insert "")
    (let ((end (copy-marker (point) t)))
      (cons start end))))

(defun ua4k--insert-region-and-markers (string)
  "Insert STRING and return a start/end marker pair for it."
  (let ((start (copy-marker (point) nil)))
    (insert string)
    (cons start (copy-marker (point) nil))))

(defun ua4k--replace-region-between-markers (start end string)
  "Replace text between START and END markers with STRING."
  (save-excursion
    (let ((start-pos (marker-position start)))
      (goto-char start-pos)
      (delete-region start end)
      ;; Deleting the region can collapse START to the old end position.
      ;; Re-anchor both markers around the newly inserted replacement.
      (set-marker start start-pos)
      (goto-char start-pos)
      (insert string)
      (set-marker end (point)))))

(defun ua4k--render-full ()
  "Render the entire buffer, rebuilding static and dynamic sections."
  (let* ((inhibit-read-only t)
         (level (ua4k--current-level))
         (title (ua4k--rule-field level "title"))
         (description (ua4k--rule-field level "description"))
         (min-moves (ua4k--rule-field level "minMoves")))
    (erase-buffer)
    (pcase-let ((`(,header-start . ,header-end)
                 (ua4k--insert-region-and-markers (ua4k--header-string))))
      (setq ua4k--header-start header-start
            ua4k--header-end header-end))
    (when (and title (not (string-empty-p title)))
      (insert (format "%s\n" title)))
    (insert "\n")
    (pcase-let ((`(,board-start . ,board-end)
                 (ua4k--insert-region-and-markers (ua4k--board-string))))
      (setq ua4k--board-start board-start
            ua4k--board-end board-end))
    (when (and description (not (string-empty-p description)))
      (insert description "\n"))
    (when (integerp min-moves)
      (insert (format "Min moves: %d\n" min-moves)))
    (when (or (and description (not (string-empty-p description)))
              (integerp min-moves))
      (insert "\n"))
    (pcase-let ((`(,status-start . ,status-end)
                 (ua4k--insert-region-and-markers (ua4k--status-string))))
      (setq ua4k--status-start status-start
            ua4k--status-end status-end))
    (insert "Bindings:\n")
    (mapc (lambda (pair)
            (insert (format "  %s  %s\n"
                            (if (symbolp (car pair)) (symbol-name (car pair)) (car pair))
                            (ua4k--bind-description (cdr pair)))))
          ua4k--binds)
    (insert "\nExtra:\n  u  undo\n  U  restart level\n  g  reload from file\n  L  jump to level\n  q  quit\n")
    (goto-char (point-min))))

(defun ua4k--render ()
  "Render the current level into the current buffer."
  (let ((inhibit-read-only t))
    (if (and (markerp ua4k--header-start)
             (markerp ua4k--header-end)
             (markerp ua4k--board-start)
             (markerp ua4k--board-end)
             (markerp ua4k--status-start)
             (markerp ua4k--status-end))
        (progn
          (ua4k--replace-region-between-markers
           ua4k--status-start ua4k--status-end (ua4k--status-string))
          (ua4k--replace-region-between-markers
           ua4k--board-start ua4k--board-end (ua4k--board-string))
          (ua4k--replace-region-between-markers
           ua4k--header-start ua4k--header-end (ua4k--header-string)))
      (ua4k--render-full))))

(defun ua4k--init-level ()
  "Load the current level into the runtime."
  (let ((level (ua4k--current-level)))
    (setq ua4k--board (ua4k--string-list->board (ua4k--rule-field level "board")))
    (setq ua4k--board-history nil)
    (setq ua4k--last-row -1
          ua4k--last-col -1
          ua4k--header-start nil
          ua4k--header-end nil
          ua4k--board-start nil
          ua4k--board-end nil
          ua4k--status-start nil
          ua4k--status-end nil)
    (when (ua4k--rule-field level "tickInterval")
      (message "ua4k.el does not support tick levels yet"))))

(defun ua4k--set-level (level)
  "Jump to LEVEL."
  (when (and (integerp level) (>= level 0) (< level (length ua4k--levels)))
    (setq ua4k--level-number level)
    (ua4k--init-level)
    (ua4k--render)))

(defun ua4k-next-level ()
  "Advance to the next level."
  (interactive)
  (setq ua4k--level-number (1+ ua4k--level-number))
  (if (< ua4k--level-number (length ua4k--levels))
      (progn
        (ua4k--init-level)
        (ua4k--render))
    (let ((inhibit-read-only t))
      (erase-buffer)
      (insert "You have completed all levels.\n"))))

(defun ua4k-undo ()
  "Undo the last move."
  (interactive)
  (when ua4k--board-history
    (setq ua4k--board (pop ua4k--board-history))
    (ua4k--render)))

(defun ua4k-restart-level ()
  "Restart the current level."
  (interactive)
  (ua4k--init-level)
  (ua4k--render))

(defun ua4k-jump-to-level (level)
  "Prompt for and jump to LEVEL."
  (interactive
   (list (string-to-number (read-string "Level number: "))))
  (ua4k--set-level level))

(defun ua4k-reload-from-file ()
  "Recompile and reload the current level from the source game file."
  (interactive)
  (unless (and (eq ua4k--source-kind 'file)
               (stringp ua4k--game-file)
               (string-match-p "\\.txt\\'" ua4k--game-file))
    (user-error "Current buffer is not backed by a source game file"))
  (let* ((data (ua4k--compile-json ua4k--game-file))
         (level-count (length (ua4k--obj-get data "levels")))
         (level (if (> level-count 0)
                    (min ua4k--level-number (1- level-count))
                  0)))
    (ua4k--load-game-into-current-buffer ua4k--game-file data level 'file)
    (message "Reloaded %s level %d" (file-name-nondirectory ua4k--game-file) level)))

(defun ua4k-quit ()
  "Quit the current ua4k buffer."
  (interactive)
  (quit-window t))

(defun ua4k--perform-action (key)
  "Apply bound KEY."
  (if (ua4k--level-complete-p)
      (ua4k-next-level)
    (let* ((entry (ua4k--obj-get ua4k--binds key))
           (command-name (ua4k--bind-command entry))
           (rule (and command-name (ua4k--obj-get ua4k--rules command-name))))
      (when (and rule ua4k--board)
        (let ((snapshot (ua4k--board-copy ua4k--board))
              ;; Self-recursive rule sets (one CALL level per board cell, as
              ;; in Game of Life implementations) need far more nesting than
              ;; the default allows.
              (max-lisp-eval-depth (max max-lisp-eval-depth 200000)))
          (when (ua4k--apply-rule rule)
            (push snapshot ua4k--board-history))))
      (ua4k--render))))

(defun ua4k-apply-sequence (sequence)
  "Apply SEQUENCE of bound keys. Useful for batch testing."
  (interactive "sSequence: ")
  (mapc (lambda (ch) (ua4k--perform-action (char-to-string ch))) sequence))

(defun ua4k--buffer-name (game-file)
  (format "*ua4k:%s*" (file-name-base game-file)))

(defun ua4k--install-keymap ()
  "Install a fresh keymap for the current game."
  (let ((map (make-sparse-keymap)))
    (set-keymap-parent map special-mode-map)
    (dolist (pair ua4k--binds)
      (let* ((raw-key (car pair))
             (key (if (symbolp raw-key) (symbol-name raw-key) raw-key)))
        (define-key map (kbd key)
                    (lambda ()
                      (interactive)
                      (ua4k--perform-action key)))))
    (define-key map (kbd "u") #'ua4k-undo)
    (define-key map (kbd "U") #'ua4k-restart-level)
    (define-key map (kbd "g") #'ua4k-reload-from-file)
    (define-key map (kbd "L") #'ua4k-jump-to-level)
    (define-key map (kbd "q") #'ua4k-quit)
    (use-local-map map)))

(define-derived-mode ua4k-mode special-mode "UA4K"
  "Major mode for playing UA4K games."
  (setq buffer-read-only t)
  (setq-local truncate-lines nil)
  (visual-line-mode 1))

(defun ua4k--load-game-into-current-buffer (game-file data level source-kind)
  "Load GAME-FILE using compiled DATA at LEVEL with SOURCE-KIND."
  (setq data (ua4k--normalize-compiled-data data))
  (ua4k-mode)
  (setq ua4k--game-file game-file
        ua4k--source-kind source-kind
        ua4k--game-data data
        ua4k--levels (ua4k--obj-get data "levels")
        ua4k--rules (ua4k--obj-get data "rules")
        ua4k--binds (ua4k--obj-get data "binds")
        ua4k--goals (ua4k--obj-get data "goals")
        ua4k--voids (ua4k--obj-get data "voids")
        ua4k--char-map (ua4k--obj-get data "charMap")
        ua4k--color-map (ua4k--obj-get data "colorMap")
        ua4k--whitespace-chars (ua4k--obj-get data "whitespaceChars")
        ua4k--hidden-line-chars (ua4k--obj-get data "hiddenLineChars")
        ua4k--level-number (or level 0))
  (ua4k--install-keymap)
  (ua4k--init-level)
  (ua4k--render))

(defun ua4k--start-game (game-file data level &optional source-kind)
  "Open GAME-FILE using compiled DATA at LEVEL with SOURCE-KIND."
  (let ((buffer (get-buffer-create (ua4k--buffer-name game-file))))
    (with-current-buffer buffer
      (ua4k--load-game-into-current-buffer game-file data level (or source-kind 'file)))
    (pop-to-buffer buffer)))

;;;###autoload
(defun ua4k-play-file (game-file &optional level)
  "Compile and play GAME-FILE, starting at LEVEL."
  (interactive
   (list (read-file-name "UA4K game file: " (ua4k--repo-root) nil t nil
                         (lambda (f) (string-match-p "\\.txt\\'" f)))
         current-prefix-arg))
  (let* ((file (expand-file-name game-file))
         (data (ua4k--compile-json file))
         (level-number (when level (prefix-numeric-value level))))
    (ua4k--start-game file data level-number 'file)))

;;;###autoload
(defun ua4k-play-game (game-name &optional level)
  "Compile and play GAME-NAME from the repo root."
  (interactive "sUA4K game name: ")
  (ua4k-play-file (expand-file-name (format "%s.txt" game-name) (ua4k--repo-root)) level))

;;;###autoload
(defun ua4k-play-asset-file (asset-file &optional level)
  "Load compiled ASSET-FILE and play it, starting at LEVEL."
  (interactive
   (list (read-file-name "UA4K asset file: "
                         (or ua4k-asset-directory (ua4k--repo-root))
                         nil t nil
                         (lambda (f) (string-match-p "\\.el\\'" f)))
         current-prefix-arg))
  (let* ((file (expand-file-name asset-file))
         (game-name (replace-regexp-in-string "^ua4k-data-" ""
                                              (file-name-base file)))
         (feature (ua4k--asset-feature-symbol game-name))
         (variable (ua4k--asset-variable-symbol game-name))
         (level-number (when level (prefix-numeric-value level))))
    (load file nil t)
    (unless (featurep feature)
      (error "Asset file did not provide %S" feature))
    (unless (boundp variable)
      (error "Asset file did not define %S" variable))
    (ua4k--start-game file (symbol-value variable) level-number 'asset)))

;;;###autoload
(defun ua4k-play-asset (game-name &optional level)
  "Play precompiled GAME-NAME from `ua4k-asset-directory'."
  (interactive "sUA4K compiled game name: ")
  (unless ua4k-asset-directory
    (error "Set `ua4k-asset-directory' or use `ua4k-play-asset-file'"))
  (ua4k-play-asset-file
   (expand-file-name (format "ua4k-data-%s.el" game-name) ua4k-asset-directory)
   level))

(defun ua4k--parse-snippet-board (text)
  "Parse raw board TEXT into a list of equal-width rows."
  (let* ((rows (split-string (string-trim text) "\n" t))
         (width (and rows (length (car rows)))))
    (unless rows
      (error "Snippet is empty"))
    (dolist (row rows)
      (unless (= (length row) width)
        (error "Snippet rows must all have the same width")))
    rows))

;;;###autoload
(defun ua4k-play-region (start end game-file)
  "Play region START..END as a single level using GAME-FILE's rules."
  (interactive
   (if (use-region-p)
       (list (region-beginning)
             (region-end)
             (read-file-name "Base UA4K game file: "
                             (file-name-directory (ua4k--game-file-prompt-default))
                             (ua4k--game-file-prompt-default)
                             t nil
                             (lambda (f) (string-match-p "\\.txt\\'" f))))
     (user-error "Select a board region first")))
  (let* ((rows (ua4k--parse-snippet-board
                (buffer-substring-no-properties start end)))
         (compiled (ua4k--compile-json (expand-file-name game-file)))
         (snippet-level
          `((board . ,rows)
            (title . "Snippet")
            (description . ,(format "Snippet from %s" (file-name-nondirectory game-file)))))
         (data
          `((levels . ,(list snippet-level))
            (rules . ,(ua4k--obj-get compiled "rules"))
            (binds . ,(ua4k--obj-get compiled "binds"))
            (goals . ,(ua4k--obj-get compiled "goals"))
            (voids . ,(ua4k--obj-get compiled "voids"))
            (charMap . ,(ua4k--obj-get compiled "charMap"))
            (colorMap . ,(ua4k--obj-get compiled "colorMap"))
            (whitespaceChars . ,(ua4k--obj-get compiled "whitespaceChars"))
            (hiddenLineChars . ,(ua4k--obj-get compiled "hiddenLineChars")))))
    (ua4k--start-game game-file data 0 'region)))

(provide 'ua4k)

;;; ua4k.el ends here
