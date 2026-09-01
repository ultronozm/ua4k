;;; ua4k-tests.el --- ERT tests for the ua4k Emacs runtime -*- lexical-binding: t; -*-

;;; Commentary:

;; Native tests for the Emacs rule runtime, sharing fixtures with the
;; browser-runtime suite (collab decision D25).  Run with:
;;
;;   make check-emacs
;;
;; or directly:
;;
;;   emacs -Q --batch -L emacs -l ua4k-tests -f ert-run-tests-batch-and-exit

;;; Code:

(require 'ert)
(require 'ua4k)
(require 'ua4k-dsl-mode)

(defun ua4k-tests--fixture (name)
  "Return the absolute path of fixture NAME under tests/fixtures."
  (expand-file-name (format "tests/fixtures/%s.txt" name) (ua4k--repo-root)))

(defun ua4k-tests--invalid-fixture (name)
  "Return the absolute path of invalid fixture NAME."
  (expand-file-name (format "tests/invalid-fixtures/%s.txt" name)
                    (ua4k--repo-root)))

(defun ua4k-tests--read-json (file)
  "Read JSON FILE using the same representation as `ua4k--compile-json'."
  (with-temp-buffer
    (insert-file-contents file)
    (json-parse-buffer :object-type 'alist :array-type 'list
                       :null-object nil :false-object nil)))

(defun ua4k-tests--compile-error-message (file)
  "Compile FILE and return its error message, failing if it compiles."
  (condition-case err
      (progn
        (ua4k--compile-json file)
        (ert-fail (format "Expected compilation to fail: %s" file)))
    (error (error-message-string err))))

(defmacro ua4k-tests--with-game (data &rest body)
  "Load compiled DATA into a temporary game buffer and run BODY."
  (declare (indent 1))
  `(with-temp-buffer
     (ua4k--load-game-into-current-buffer "test-game" ,data 0 'file)
     ,@body))

(defun ua4k-tests--board-rows ()
  "Current board as a list of strings."
  (ua4k--board-rows))

(defun ua4k-tests--set-board (rows)
  "Replace the current test board with ROWS and clear undo history."
  (setq ua4k--board (ua4k--string-list->board rows)
        ua4k--board-history nil))

(ert-deftest ua4k-tests-wildcard-redirection ()
  "With WILDCARD *, `*' is the wildcard and `?' is an ordinary literal.
Shares tests/fixtures/fixture-wildcard.txt with the browser suite; the
expected boards match `node replay_level.js` on the same fixture."
  (let ((data (ua4k--compile-json (ua4k-tests--fixture "fixture-wildcard"))))
    (ua4k-tests--with-game data
      (should (eq ua4k--wildcard-char ?*))
      (should (equal (ua4k-tests--board-rows) '("?-1")))
      (ua4k--perform-action "a")
      (should (equal (ua4k-tests--board-rows) '("?1-")))
      (ua4k--perform-action "a")
      ;; The literal `?' swapped with `1'; the trailing `*' preserved the
      ;; final cell; the GOAL pattern containing a literal `?' is now met.
      (should (equal (ua4k-tests--board-rows) '("1?-")))
      (should (ua4k--level-complete-p)))))

(ert-deftest ua4k-tests-default-wildcard ()
  "Without a WILDCARD declaration, `?' keeps its match-any/preserve roles."
  (let ((data
         '((levels . ((("board" . ("ac"))))
                   )
           (rules . (("go" . (("type" . "simple")
                              ("from" . ("a?"))
                              ("to" . ("b?"))
                              ("side_effects" . ())
                              ("method" . "firstmatch")))))
           (binds . (("g" . "go")))
           (goals . (("b")))
           (voids . ()))))
    (ua4k-tests--with-game data
      (should (eq ua4k--wildcard-char ?\?))
      (ua4k--perform-action "g")
      ;; `?' matched the `c' in the source and preserved it in the
      ;; destination.
      (should (equal (ua4k-tests--board-rows) '("bc"))))))

(defmacro ua4k-tests--with-fixture (name &rest body)
  "Compile fixture NAME, load it, and run BODY in its game buffer."
  (declare (indent 1))
  `(let ((data (ua4k--compile-json (ua4k-tests--fixture ,name))))
     (ua4k-tests--with-game data
       ,@body)))

(ert-deftest ua4k-tests-capture-carry-and-equality ()
  "Shared capture fixture replays to the same boards as the browser runtime.
Covers register read, floor pickup/drop via two variables, and within-
pattern equality (`11' folds AA and skips AB)."
  (ua4k-tests--with-fixture "fixture-capture"
    (should (equal (ua4k-tests--board-rows) '("!.G.-E" "#AB#AA")))
    (ua4k--perform-action "m")
    (should (equal (ua4k-tests--board-rows) '("!.G.-E" "#AB#AE")))
    (ua4k--perform-action "d")
    (should (equal (ua4k-tests--board-rows) '("!..G-E" "#AB#AE")))
    (ua4k--perform-action "d")
    (should (equal (ua4k-tests--board-rows) '("!-..GE" "#AB#AE")))
    (should (ua4k--level-complete-p))))

(ert-deftest ua4k-tests-capture-repeat-lifetimes ()
  "R13/R14: outer-declared REPEAT persists a binding, inner is fresh."
  (ua4k-tests--with-fixture "fixture-capture-repeat"
    (ua4k--perform-action "o")
    (should (equal (ua4k-tests--board-rows) '("-AB-")))
    (ua4k--perform-action "i")
    (should (equal (ua4k-tests--board-rows) '("--AB")))))

(ert-deftest ua4k-tests-capture-wide-and-unmasked-literal ()
  "Six-variable row copy plus the D23 unmasked-literal poke."
  (ua4k-tests--with-fixture "fixture-capture-wide"
    (ua4k--perform-action "c")
    (should (equal (ua4k-tests--board-rows)
                   '("#ABCACB#" "#ABCACB#" "#1A#####")))
    (ua4k--perform-action "l")
    (should (equal (ua4k-tests--board-rows)
                   '("#ABCACB#" "#ABCACB#" "#1E#####")))))

(ert-deftest ua4k-tests-capture-under-redirected-wildcard ()
  "W6 Emacs half: captures and redirected wildcard interact per D18/D26.
`c' binds and rewrites a literal `*' cell through a NOT class, `q' uses
`?' as an ordinary variable name under WILDCARD *, and `l' matches a
literal `?' in a pattern.  Expected boards come from the browser runtime
replay of the same fixture."
  (ua4k-tests--with-fixture "fixture-wildcard-capture"
    (should (eq ua4k--wildcard-char ?*))
    (ua4k--perform-action "c")
    (should (equal (ua4k-tests--board-rows) '("C**?QA-")))
    (ua4k--perform-action "q")
    (should (equal (ua4k-tests--board-rows) '("C**?QAE")))
    (ua4k--perform-action "l")
    (should (equal (ua4k-tests--board-rows) '("C**!QAE")))))

(ert-deftest ua4k-tests-capture-hidden-line-value ()
  "R21b Emacs half: a capture binds and copies a hidden-line character;
the underlying board write happens even though rendering suppresses the
row."
  (let ((data
         '((levels . ((("board" . ("%a" "-b")))))
           (rules . (("go" . (("type" . "atomic")
                              ("variables" . (("1" . (("domain" . "%") ("negated" . nil)))))
                              ("rules" . ((("type" . "simple")
                                           ("from" . ("1a"))
                                           ("to" . ("1a"))
                                           ("side_effects" . ())
                                           ("method" . "firstmatch")
                                           ("fromVariables" . (0))
                                           ("toVariables" . (0)))
                                          (("type" . "simple")
                                           ("from" . ("-b"))
                                           ("to" . ("1b"))
                                           ("side_effects" . ())
                                           ("method" . "firstmatch")
                                           ("toVariables" . (0)))))))))
           (binds . (("g" . "go")))
           (goals . (("Z")))
           (voids . ())
           (hiddenLineChars . ("%")))))
    (ua4k-tests--with-game data
      (ua4k--perform-action "g")
      ;; The hidden `%' was captured from the hidden row and written onto
      ;; the visible row's first cell.
      (should (equal (ua4k-tests--board-rows) '("%a" "%b"))))))

(ert-deftest ua4k-tests-scan-continues-after-candidate-application-failure ()
  "D30: align Emacs with browser candidate scanning.
The first full source match fails its mandatory side effect; the simple rule
continues scanning and applies at the later candidate where the side effect
succeeds."
  (ua4k-tests--with-fixture "fixture-scan-continuation"
    (ua4k--perform-action "x")
    (should (equal (ua4k-tests--board-rows) '("A-BE")))
    (ua4k-tests--set-board '("A-B-"))
    (ua4k--perform-action "y")
    (should (equal (ua4k-tests--board-rows) '("AEB-")))))

(ert-deftest ua4k-tests-capture-adversarial-rollback-and-scope ()
  "Shared D9/D18/D28 probes against the native Elisp runtime."
  (ua4k-tests--with-fixture "fixture-capture-adversarial"
    ;; Mandatory failure drops both its tentative write/binding; fallback
    ;; binds B and succeeds.
    (ua4k-tests--set-board '("A-#BQ"))
    (ua4k--perform-action "d")
    (should (equal (ua4k-tests--board-rows) '("A-#BE")))
    ;; A nested local expires, a called capture with the same name is fresh,
    ;; the outer binding survives, and a called literal remains literal.
    (ua4k-tests--set-board '("AaCcCmAq2l1z"))
    (ua4k--perform-action "g")
    (should (equal (ua4k-tests--board-rows) '("AbCdCnAe2e1y")))
    ;; A path-dependent unbound destination fails before its earlier literal
    ;; destination cell can be written.
    (ua4k-tests--set-board '("Q-"))
    (ua4k--perform-action "h")
    (should (equal (ua4k-tests--board-rows) '("Q-")))
    ;; A captured wildcard value writes literally and later equality is exact.
    (ua4k-tests--set-board '("C?-K?"))
    (ua4k--perform-action "q")
    (should (equal (ua4k-tests--board-rows) '("C??KZ")))))

(ert-deftest ua4k-tests-init-command-runs-on-level-load ()
  "The _init command applies once per level load, as in the browser.
Tetris relies on it to populate the preview and spawn the first piece;
without it the Emacs frontend showed an empty, inert well."
  (let ((data (ua4k--compile-json
               (expand-file-name "games/clones/tetris.txt" (ua4k--repo-root)))))
    (ua4k-tests--with-game data
      ;; A piece exists somewhere in the spawn rows and stepping moves it.
      (let ((before (ua4k-tests--board-rows)))
        (should (cl-some (lambda (row) (string-match-p "[xo]" row)) before))
        (ua4k--perform-action "s")
        (should-not (equal (ua4k-tests--board-rows) before))))))

(ert-deftest ua4k-tests-tick-timer-applies-and-stops-on-completion ()
  "A tick level schedules _tick without polluting manual undo history."
  (let ((data
         '((levels . ((("board" . ("A")) ("tickInterval" . 100000))))
           (rules . (("_tick" . (("type" . "simple")
                                  ("from" . ("A"))
                                  ("to" . ("B"))
                                  ("side_effects" . ())
                                  ("method" . "firstmatch")))))
           (binds . ())
           (goals . (("B")))
           (voids . ()))))
    (ua4k-tests--with-game data
      (should (timerp ua4k--tick-timer))
      ;; Invoke the callback directly: timer scheduling and tick behavior are
      ;; tested without a wall-clock race in batch mode.
      (ua4k--tick (current-buffer))
      (should (equal (ua4k-tests--board-rows) '("B")))
      (should-not ua4k--board-history)
      (should-not ua4k--tick-timer))))

(ert-deftest ua4k-tests-command-template-golden-and-native-runtime ()
  "D45: the Emacs compile path matches the ZIP_CMDS/FOR_CMDS golden.
The generated command is then executed by the native Elisp rule runtime,
including its mandatory generated side-effect reference."
  (let* ((compiled (ua4k--compile-json
                    (ua4k-tests--fixture "fixture-zipcmds")))
         (golden (ua4k-tests--read-json
                  (expand-file-name "tests/snapshots/fixture-zipcmds.json"
                                    (ua4k--repo-root)))))
    ;; Pins both grammar forms, marker composition, product order,
    ;; template-before-orbit, and literal angle-bracket preservation.
    (should (equal compiled golden))
    (ua4k-tests--with-game compiled
      ;; step_aa moves A and calls mark_a_e!; the lower-case a and literal
      ;; angle-register pair satisfy the generated atomic side effect.
      (ua4k-tests--set-board '("A-a<>" "-----"))
      (should (ua4k--apply-rule (ua4k--obj-get ua4k--rules "step_aa")))
      (should (equal (ua4k-tests--board-rows) '("-Aa<>" "-----"))))))

(ert-deftest ua4k-tests-command-template-invalid-diagnostics ()
  "D45 invalid fixtures report the canonical compiler diagnostics in Emacs."
  (dolist
      (case
       '(("invalid-zipcmds-unequal"
          . "ZIP_CMDS value lists must have equal length: 2 vs 3")
         ("invalid-zipcmds-no-marker"
          . "template name 'stepx' must contain the first variable marker <g>")
         ("invalid-zipcmds-unknown-marker"
          . "template marker <z> names an undeclared variable")
         ("invalid-zipcmds-unused"
          . "template variable 'G' is declared but never used")
         ("invalid-zipcmds-duplicate"
          . "template generates duplicate command name 'step_a'")
         ("invalid-zipcmds-reserved"
          . "command name 'step_a' is reserved by a template")
         ("invalid-zipcmds-wildcard-value"
          . "template value list for 'g' contains the wildcard '?'")
         ("invalid-zipcmds-for-collision"
          . "template variable or value 'g' collides with a FOR variable declared on line 2")
         ("invalid-zipcmds-orbit-collision"
          . "template variable or value 'e' collides with an orbit character")
         ("invalid-zipcmds-capture-collision"
          . "template variable or value 'b' collides with a capture variable declared on line 2")
         ("invalid-zipcmds-nested"
          . "ZIP_CMDS may not be nested inside a template")))
    (let ((message
           (ua4k-tests--compile-error-message
            (ua4k-tests--invalid-fixture (car case)))))
      (should (string-match-p (regexp-quote (cdr case)) message)))))

(ert-deftest ua4k-tests-command-template-dsl-mode-support ()
  "The Emacs authoring mode recognizes command templates as definitions."
  (should (member "ZIP_CMDS" ua4k-dsl-directives))
  (should (member "FOR_CMDS" ua4k-dsl-directives))
  (with-temp-buffer
    (insert "ZIP_CMDS step_<g><g> g ab\n g- -g helper_<g>!\n\n"
            "FOR_CMDS outer_<x> x pq\n ?? ??\n\nCMD done\n ? ?\n")
    (ua4k-dsl-mode)
    (font-lock-ensure)
    (goto-char (point-min))
    (search-forward "ZIP_CMDS")
    (should (eq (get-text-property (1- (point)) 'face)
                'font-lock-keyword-face))
    (goto-char (point-max))
    (should (ua4k-dsl-beginning-of-defun))
    (should (looking-at-p "CMD done"))
    (should (ua4k-dsl-beginning-of-defun))
    (should (looking-at-p "FOR_CMDS outer_<x>"))))

(ert-deftest ua4k-tests-class-dsl-mode-support ()
  "The authoring mode recognizes CLASS declarations and NOT modifiers."
  (should (member "CLASS" ua4k-dsl-directives))
  (with-temp-buffer
    (insert "CLASS floor -.\nCLASS actor NOT -.\n")
    (ua4k-dsl-mode)
    (font-lock-ensure)
    (goto-char (point-min))
    (search-forward "CLASS")
    (should (eq (get-text-property (1- (point)) 'face)
                'font-lock-keyword-face))
    (search-forward "floor")
    (should (eq (get-text-property (1- (point)) 'face)
                'font-lock-type-face))
    (search-forward "NOT")
    (should (eq (get-text-property (1- (point)) 'face)
                'font-lock-builtin-face))))

(ert-deftest ua4k-tests-command-template-pacman-loads ()
  "The shipped templated Pacman compiles and normalizes in the Emacs frontend."
  (let ((data (ua4k--compile-json
               (expand-file-name "games/clones/pacman.txt" (ua4k--repo-root)))))
    (should (ua4k--obj-get (ua4k--obj-get data "rules") "try_r_e"))
    (should (ua4k--obj-get (ua4k--obj-get data "rules") "respawn_q"))
    (should-not
     (cl-find-if (lambda (pair)
                   (string-match-p "[<>]" (if (symbolp (car pair))
                                                (symbol-name (car pair))
                                              (car pair))))
                 (ua4k--obj-get data "rules")))
    (ua4k-tests--with-game data
      (should (= (length (ua4k-tests--board-rows)) 38))
      (should (ua4k--obj-get ua4k--rules "ghost_move")))))

(provide 'ua4k-tests)

;;; ua4k-tests.el ends here
