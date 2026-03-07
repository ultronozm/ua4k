;;; ua4k.el --- Emacs interface for UA4K games -*- lexical-binding: t; -*-

;; Copyright (C) 2026

;;; Commentary:

;; Play compiled UA4K games inside Emacs.
;;
;; Entry points:
;;   M-x ua4k-play-file
;;   M-x ua4k-play-game
;;
;; This frontend intentionally targets non-tick games first. It interprets the
;; same compiled JSON IR used by the browser runtime, so it does not need a
;; second DSL parser in Elisp.

;;; Code:

(require 'cl-lib)
(require 'json)
(require 'subr-x)

(defgroup ua4k nil
  "Play UA4K games in Emacs."
  :group 'games)

(defcustom ua4k-python-command "python3"
  "Python executable used to compile game files into JSON."
  :type 'string)

(defvar-local ua4k--game-data nil)
(defvar-local ua4k--levels nil)
(defvar-local ua4k--rules nil)
(defvar-local ua4k--binds nil)
(defvar-local ua4k--goals nil)
(defvar-local ua4k--voids nil)
(defvar-local ua4k--board nil)
(defvar-local ua4k--board-history nil)
(defvar-local ua4k--level-number 0)
(defvar-local ua4k--game-file nil)
(defvar-local ua4k--last-row -1)
(defvar-local ua4k--last-col -1)

(defun ua4k--repo-root ()
  "Return the repository root for the current `ua4k.el' file."
  (file-name-directory (or load-file-name buffer-file-name default-directory)))

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

(defun ua4k--string-list->board (rows)
  "Convert ROWS (a list of strings) into a mutable board."
  (vconcat (mapcar (lambda (row) (string-to-vector row)) rows)))

(defun ua4k--board-copy (board)
  "Deep copy BOARD."
  (vconcat (mapcar #'copy-sequence board)))

(defun ua4k--board-height ()
  (length ua4k--board))

(defun ua4k--board-width ()
  (if (> (length ua4k--board) 0) (length (aref ua4k--board 0)) 0))

(defun ua4k--board-rows ()
  "Render the current board into a list of strings."
  (mapcar #'concat (append ua4k--board nil)))

(defun ua4k--pattern-height (pattern)
  (length pattern))

(defun ua4k--pattern-width (pattern)
  (if pattern (length (car pattern)) 0))

(defun ua4k--pattern-char (pattern row col)
  (aref (nth row pattern) col))

(defun ua4k--pattern-match (pattern row col)
  "Return non-nil if PATTERN matches the current board at ROW/COL."
  (let ((height (ua4k--pattern-height pattern))
        (width (ua4k--pattern-width pattern)))
    (when (and (>= row 0)
               (>= col 0)
               (<= (+ row height) (ua4k--board-height))
               (<= (+ col width) (ua4k--board-width)))
      (cl-loop for i from 0 below height
               always
               (cl-loop for j from 0 below width
                        always
                        (let ((cell (ua4k--pattern-char pattern i j))
                              (board-cell (aref (aref ua4k--board (+ row i)) (+ col j))))
                          (or (eq cell ?\?)
                              (eq cell board-cell))))))))

(defun ua4k--pattern-occurs (pattern)
  "Return non-nil if PATTERN occurs anywhere on the current board."
  (cl-loop for row from 0 below (ua4k--board-height)
           thereis
           (cl-loop for col from 0 below (ua4k--board-width)
                    thereis (ua4k--pattern-match pattern row col))))

(defun ua4k--level-complete-p ()
  "Return non-nil if goals are satisfied and voids are absent."
  (and
   (cl-every #'ua4k--pattern-occurs ua4k--goals)
   (cl-every (lambda (void-pattern) (not (ua4k--pattern-occurs void-pattern))) ua4k--voids)))

(defun ua4k--rule-type (rule)
  (ua4k--obj-get rule "type"))

(defun ua4k--rule-field (rule key)
  (ua4k--obj-get rule key))

(defun ua4k--apply-rule-at (rule row col)
  "Apply simple RULE at ROW/COL."
  (let* ((from-pattern (ua4k--rule-field rule "from"))
         (to-pattern (ua4k--rule-field rule "to"))
         (side-effects (ua4k--rule-field rule "side_effects"))
         (height (ua4k--pattern-height to-pattern))
         (width (ua4k--pattern-width to-pattern))
         (snapshot (ua4k--board-copy ua4k--board)))
    (dotimes (i height)
      (dotimes (j width)
        (let ((cell (ua4k--pattern-char to-pattern i j)))
          (unless (eq cell ?\?)
            (aset (aref ua4k--board (+ row i)) (+ col j) cell)))))
    (dolist (side-effect side-effects)
      (if (string-suffix-p "!" side-effect)
          (let ((name (substring side-effect 0 -1)))
            (unless (ua4k--apply-rule (ua4k--obj-get ua4k--rules name))
              (setq ua4k--board snapshot)
              (cl-return-from ua4k--apply-rule-at nil)))
        (ua4k--apply-rule (ua4k--obj-get ua4k--rules side-effect))))
    t))

(defun ua4k--apply-simple-rule (rule &optional min-row min-col)
  "Apply simple RULE searching from MIN-ROW / MIN-COL."
  (let* ((min-row (or min-row 0))
         (min-col (or min-col 0))
         (height (ua4k--board-height))
         (width (ua4k--board-width))
         (method (ua4k--rule-field rule "method"))
         (from-pattern (ua4k--rule-field rule "from")))
    (cond
     ((string= method "random")
      (let (matches)
        (cl-loop for row from min-row below height do
                 (cl-loop for col from min-col below width do
                          (when (ua4k--pattern-match from-pattern row col)
                            (push (cons row col) matches))))
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
                 (cl-loop for col downfrom (1- width) to min-col do
                          (when (ua4k--pattern-match from-pattern row col)
                            (setq ua4k--last-row row
                                  ua4k--last-col col)
                            (throw 'ua4k-found (ua4k--apply-rule-at rule row col)))))
        nil))
     (t
      (catch 'ua4k-found
        (cl-loop for row from min-row below height do
                 (cl-loop for col from min-col below width do
                          (when (ua4k--pattern-match from-pattern row col)
                            (setq ua4k--last-row row
                                  ua4k--last-col col)
                            (throw 'ua4k-found (ua4k--apply-rule-at rule row col)))))
        nil)))))

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

(defun ua4k--apply-rule (rule &optional min-row min-col)
  "Apply compiled RULE."
  (when rule
    (pcase (ua4k--rule-type rule)
      ("simple" (ua4k--apply-simple-rule rule min-row min-col))
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

(defun ua4k--render ()
  "Render the current level into the current buffer."
  (let* ((inhibit-read-only t)
         (level (ua4k--current-level))
         (title (ua4k--rule-field level "title"))
         (description (ua4k--rule-field level "description"))
         (min-moves (ua4k--rule-field level "minMoves"))
         (game-name (file-name-base (or ua4k--game-file "ua4k"))))
    (erase-buffer)
    (insert (format "%s  Level %d/%d  Moves: %d\n"
                    game-name
                    ua4k--level-number
                    (1- (length ua4k--levels))
                    (length ua4k--board-history)))
    (when (and title (not (string-empty-p title)))
      (insert (format "%s\n" title)))
    (when (and description (not (string-empty-p description)))
      (insert description "\n"))
    (when (integerp min-moves)
      (insert (format "Min moves: %d\n" min-moves)))
    (insert "\n")
    (dolist (row (ua4k--board-rows))
      (insert row "\n"))
    (insert "\n")
    (when (ua4k--level-complete-p)
      (insert "Level complete. Press any movement key to advance.\n\n"))
    (insert "Bindings:\n")
    (mapc (lambda (pair)
            (insert (format "  %s  %s\n"
                            (if (symbolp (car pair)) (symbol-name (car pair)) (car pair))
                            (ua4k--bind-description (cdr pair)))))
          ua4k--binds)
    (insert "\nExtra:\n  u  undo\n  U  restart level\n  l  jump to level\n  q  quit\n")
    (goto-char (point-min))))

(defun ua4k--init-level ()
  "Load the current level into the runtime."
  (let ((level (ua4k--current-level)))
    (setq ua4k--board (ua4k--string-list->board (ua4k--rule-field level "board")))
    (setq ua4k--board-history nil)
    (setq ua4k--last-row -1
          ua4k--last-col -1)
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
        (let ((snapshot (ua4k--board-copy ua4k--board)))
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
    (define-key map (kbd "l") #'ua4k-jump-to-level)
    (define-key map (kbd "q") #'ua4k-quit)
    (use-local-map map)))

(define-derived-mode ua4k-mode special-mode "UA4K"
  "Major mode for playing UA4K games."
  (setq buffer-read-only t))

(defun ua4k--start-game (game-file data level)
  "Open GAME-FILE using compiled DATA at LEVEL."
  (let ((buffer (get-buffer-create (ua4k--buffer-name game-file))))
    (with-current-buffer buffer
      (ua4k-mode)
      (setq ua4k--game-file game-file
            ua4k--game-data data
            ua4k--levels (ua4k--obj-get data "levels")
            ua4k--rules (ua4k--obj-get data "rules")
            ua4k--binds (ua4k--obj-get data "binds")
            ua4k--goals (ua4k--obj-get data "goals")
            ua4k--voids (ua4k--obj-get data "voids")
            ua4k--level-number (or level 0))
      (ua4k--install-keymap)
      (ua4k--init-level)
      (ua4k--render))
    (pop-to-buffer buffer)))

(defun ua4k-play-file (game-file &optional level)
  "Compile and play GAME-FILE, starting at LEVEL."
  (interactive
   (list (read-file-name "UA4K game file: " (ua4k--repo-root) nil t nil
                         (lambda (f) (string-match-p "\\.txt\\'" f)))
         current-prefix-arg))
  (let* ((file (expand-file-name game-file))
         (data (ua4k--compile-json file))
         (level-number (when level (prefix-numeric-value level))))
    (ua4k--start-game file data level-number)))

(defun ua4k-play-game (game-name &optional level)
  "Compile and play GAME-NAME from the repo root."
  (interactive "sUA4K game name: ")
  (ua4k-play-file (expand-file-name (format "%s.txt" game-name) (ua4k--repo-root)) level))

(provide 'ua4k)

;;; ua4k.el ends here
