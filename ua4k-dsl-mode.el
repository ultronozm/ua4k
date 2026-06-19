;;; ua4k-dsl-mode.el --- Font-lock for UA4K DSL files -*- lexical-binding: t; -*-

;; Author: Paul D. Nelson
;; Keywords: languages

;;; Commentary:

;; Lightweight major mode for authoring UA4K game DSL files.

;;; Code:

(defconst ua4k-dsl-directives
  '("GOAL" "VOID" "HIDDEN_LINE_CHAR" "DESCRIPTION" "TICK" "TITLE"
    "WHITESPACE" "CHARMAP" "COLOR" "BY" "BIND" "FOR" "ZIP"
    "LET_REPEAT" "ROTATE" "ATOMIC" "ATOMIC_VERTICAL" "ATOMIC_HORIZONTAL"
    "MATCH1" "TRY_ALL" "RANDOM" "CALL" "CALL_EACH" "ROTATE_CMDS" "CMD")
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

;;;###autoload
(define-derived-mode ua4k-dsl-mode text-mode "UA4K-DSL"
  "Major mode for UA4K game DSL files."
  (setq-local comment-start ";; ")
  (setq-local comment-start-skip ";;+\\s-*")
  (setq-local font-lock-defaults '(ua4k-dsl-font-lock-keywords)))

(provide 'ua4k-dsl-mode)

;;; ua4k-dsl-mode.el ends here
