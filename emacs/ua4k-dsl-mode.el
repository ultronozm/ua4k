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

(defconst ua4k-dsl-directives
  '("GOAL" "VOID" "HIDDEN_LINE_CHAR" "DESCRIPTION" "MINMOVES" "TICK" "TITLE"
    "WHITESPACE" "CHARMAP" "COLOR" "BY" "BIND" "FOR" "ZIP"
    "LET_REPEAT" "ROTATE" "ATOMIC" "ATOMIC_VERTICAL" "ATOMIC_HORIZONTAL"
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

;;;###autoload
;;;###autoload
(define-derived-mode ua4k-dsl-mode text-mode "UA4K-DSL"
  "Major mode for UA4K game DSL files."
  (setq-local comment-start ";; ")
  (setq-local comment-start-skip ";;+\\s-*")
  (setq-local font-lock-defaults '(ua4k-dsl-font-lock-keywords)))

(provide 'ua4k-dsl-mode)

;;; ua4k-dsl-mode.el ends here
