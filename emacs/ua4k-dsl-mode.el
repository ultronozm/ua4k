;;; ua4k-dsl-mode.el --- Major mode for UA4K game files -*- lexical-binding: t; -*-

;; Copyright (C) 2026  Paul D. Nelson

;; Author: Paul D. Nelson <nelson.paul.david@gmail.com>
;; Version: 0.1
;; URL: https://github.com/ultronozm/ua4k
;; Package-Requires: ((emacs "27.1"))
;; Keywords: languages, games

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

;; Lightweight major mode for authoring UA4K game DSL files.

;;; Code:

(autoload 'ua4k-play-buffer "ua4k" nil t)
(autoload 'ua4k-play-region "ua4k" nil t)
(require 'xref)

(defgroup ua4k-dsl nil
  "Editing UA4K game DSL files."
  :group 'languages)

(defcustom ua4k-dsl-indent-offset 2
  "Number of columns used by UA4K DSL rigid indentation commands."
  :type 'integer
  :safe #'integerp
  :group 'ua4k-dsl)

(defconst ua4k-dsl-directives
  '("GOAL" "VOID" "HIDDEN_LINE_CHAR" "DESCRIPTION" "MINMOVES" "TICK" "TITLE"
    "WHITESPACE" "CHARMAP" "COLOR" "BY" "BIND" "FOR" "ZIP"
    "LET_REPEAT" "ROTATE" "FLIP_HORIZONTAL" "FLIP_VERTICAL"
    "ATOMIC" "ATOMIC_VERTICAL" "ATOMIC_HORIZONTAL"
    "MATCH1" "TRY_ALL" "RANDOM" "REPEAT" "CALL" "CALL_EACH" "ROTATE_CMDS" "CMD")
  "Directive keywords accepted by `make-data.py'.")

(defconst ua4k-dsl-annotations
  '("firstmatch" "lastmatch" "random" "norotate")
  "Annotation tokens accepted inside square brackets.")

(defconst ua4k-dsl-font-lock-keywords
  (let ((directives (regexp-opt ua4k-dsl-directives t))
        (annotations (regexp-opt ua4k-dsl-annotations t)))
    `((,(concat "^[ \t]*\\(" directives "\\)\\_>")
       (1 font-lock-keyword-face))
      (,(concat "\\[\\(" annotations "\\)\\]")
       (1 font-lock-builtin-face))
      ("^[ \t]*\\(CMD\\|ROTATE_CMDS\\|CALL\\)\\s-+\\([[:word:]_]+\\)\\_>"
       (1 font-lock-keyword-face)
       (2 font-lock-function-name-face))
      ("^[ \t]*\\(CALL_EACH\\)\\_>"
       (1 font-lock-keyword-face)
       ("\\(?:\\s-+\\)\\([[:word:]_]+\\)\\_>" nil nil
        (1 font-lock-function-name-face)))
      ("^[ \t]*\\(BIND\\)\\_>"
       (1 font-lock-keyword-face)
       ("\\(?:\\s-+\\)\\(?:[^ \t\n\"]+\\)\\s-+\\([[:word:]_]+\\)\\_>\\(?:\\s-+\"[^\"]*\"\\)?"
        nil nil
        (1 font-lock-function-name-face)))
      ("\\_<\\([[:word:]_]+!\\)\\_>"
       (1 font-lock-warning-face))
      ("^[ \t]*;;.*$" . font-lock-comment-face)))
  "Font-lock rules for `ua4k-dsl-mode'.")

(defun ua4k-dsl-indent-shift-left (start end &optional count)
  "Shift lines in START..END left by COUNT columns.
COUNT defaults to `ua4k-dsl-indent-offset'.  When the region is inactive,
shift the current line.  Refuse to shift if a nonblank line would pass column
zero."
  (interactive
   (if (use-region-p)
       (list (region-beginning) (region-end) current-prefix-arg)
     (list (line-beginning-position) (line-end-position) current-prefix-arg)))
  (setq count (if count (prefix-numeric-value count) ua4k-dsl-indent-offset))
  (when (> count 0)
    (let ((deactivate-mark nil))
      (save-excursion
        (goto-char start)
        (while (< (point) end)
          (when (and (< (current-indentation) count)
                     (not (looking-at-p "[ \t]*$")))
            (user-error "Can't shift all lines enough"))
          (forward-line 1))
        (indent-rigidly start end (- count))))))

(defun ua4k-dsl-indent-shift-right (start end &optional count)
  "Shift lines in START..END right by COUNT columns.
COUNT defaults to `ua4k-dsl-indent-offset'.  When the region is inactive,
shift the current line."
  (interactive
   (if (use-region-p)
       (list (region-beginning) (region-end) current-prefix-arg)
     (list (line-beginning-position) (line-end-position) current-prefix-arg)))
  (let ((deactivate-mark nil))
    (setq count (if count (prefix-numeric-value count) ua4k-dsl-indent-offset))
    (indent-rigidly start end count)))

(defun ua4k-dsl--xref-backend ()
  "Return the xref backend for a UA4K DSL buffer."
  'ua4k-dsl)

(cl-defmethod xref-backend-identifier-at-point ((_backend (eql 'ua4k-dsl)))
  (thing-at-point 'symbol t))

(cl-defmethod xref-backend-definitions ((_backend (eql 'ua4k-dsl)) identifier)
  (let ((names (list identifier)))
    (when (string-match "\\`\\(.+\\)_[eswn]\\'" identifier)
      (push (match-string 1 identifier) names))
    (save-excursion
      (goto-char (point-min))
      (let ((regexp (format "^[ \\t]*\\(?:CMD[ \\t]+%s\\|ROTATE_CMDS[ \\t]+%s\\)\\_>"
                            (regexp-quote identifier)
                            (regexp-opt names t)))
            definitions)
        (while (re-search-forward regexp nil t)
          (push (xref-make (replace-regexp-in-string
                            "\\`[ \\t]*" "" (match-string 0))
                           (xref-make-buffer-location
                            (current-buffer) (line-beginning-position)))
                definitions))
        (nreverse definitions)))))

(defvar ua4k-dsl-mode-map
  (let ((map (make-sparse-keymap)))
    (define-key map (kbd "C-c C-b") #'ua4k-play-buffer)
    (define-key map (kbd "C-c C-r") #'ua4k-play-region)
    (define-key map (kbd "C-c <") #'ua4k-dsl-indent-shift-left)
    (define-key map (kbd "C-c >") #'ua4k-dsl-indent-shift-right)
    map)
  "Keymap for `ua4k-dsl-mode'.")

;;;###autoload
(define-derived-mode ua4k-dsl-mode text-mode "UA4K-DSL"
  "Major mode for UA4K game DSL files."
  (setq-local comment-start ";; ")
  (setq-local comment-start-skip ";;+\\s-*")
  (setq-local font-lock-defaults '(ua4k-dsl-font-lock-keywords))
  (add-hook 'xref-backend-functions #'ua4k-dsl--xref-backend nil t)
  (setq-local imenu-generic-expression 
              '((nil "^\\(CMD\\|ROTATE_CMDS\\)\\s-+\\([^[:space:]]+\\)" 2))))

(provide 'ua4k-dsl-mode)

;;; ua4k-dsl-mode.el ends here
