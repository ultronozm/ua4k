;;; game.el --- a game, maybe                        -*- lexical-binding: t; -*-

;; Copyright (C) 2024  Paul D. Nelson

;; Author: Paul D. Nelson <nelson.paul.david@gmail.com>
;; Keywords: 

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

;; 

;;; Code:

(defvar *my-game-board* nil "2D list representing the game board.")
(defvar *my-game-rules* nil "List of transformation rules.")
(defconst *key-string* "asdfjkl123" "String to index the transformation rules and key bindings.")

(define-derived-mode my-game-mode special-mode "My Game"
  "Major mode for playing my game."
  (setq buffer-read-only t)
  ;; bind numeric keys to apply-rule
  (dotimes (i (min (length *key-string*) (length *my-game-rules*)))
    (let ((key (substring *key-string* i (+ i 1))))
      (define-key
       my-game-mode-map
       (kbd key)
       (lambda ()
         (interactive)
         (when (get-text-property (point) 'game)
           (setq *my-game-board*
                 (apply-rule
                  i
                  (get-text-property (point) 'row)
                  (get-text-property (point) 'col)
                  *my-game-board*))
           (draw-board)
           (if (check-board-cleared)
               (progn
                 (message "Congratulations! You have cleared the board.")
                 (setq *my-game-level* (1+ *my-game-level*))
                 (if (< *my-game-level* (length *my-game-levels*))
                     (init-level)
                   (message "You have completed all levels."))))))))))

(defun init-game (board rules)
  "Initialize the game with a 2D list representing BOARD and a list of RULES."
  (setq *my-game-board* board)
  (setq *my-game-rules* rules)
  (switch-to-buffer "*My Game*")
  (my-game-mode))

(defun draw-board ()
  "Draw the game board in a new buffer."
  (let ((buffer (get-buffer-create "*My Game*")))
    (with-current-buffer buffer
      (let ((old-point (point))
            (inhibit-read-only t))
        (erase-buffer)
        (insert "  ")
        (dotimes (j (length (nth 0 *my-game-board*)))
          (insert (format "%s" j)))
        (insert "\n")
        (dotimes (i (length *my-game-board*))
          (insert (format "%s " i))
          (let ((row (nth i *my-game-board*)))
            (dotimes (j (length row))
              (insert
               ;; store the coordinates of the cell in the text properties
               (propertize
                (symbol-name (nth j row))
                'row i
                'col j
                'game t)))
            (insert "\n")))
        (insert "\nAvailable transformations:\n")
        (dotimes (i (length *my-game-rules*))
          (let ((rule (nth i *my-game-rules*)))
            (insert (format "%s:\n\t%s -> %s\n"
                            (substring *key-string* i (+ i 1))
                            (car rule) (cdr rule)))))
        (goto-char old-point)))))

(defun check-rule (rule row col board)
  "Check if RULE can be applied at row ROW and column COL."
  (let* ((from-pattern (car rule))
	        (pattern-height (length from-pattern))
	        (pattern-width (length (car from-pattern)))
	        board-subgrid)
    (and
     (>= row 0)
     (>= col 0)
     (< (+ row pattern-height) (length board))
     (< (+ col pattern-width) (length (nth 0 board))))
    (dotimes (i pattern-height)
      (let (subgrid-row)
        (dotimes (j pattern-width)
          (push (nth (+ col j)
                     (nth (+ row i)
                          *my-game-board*))
                subgrid-row))
        (push (nreverse subgrid-row) board-subgrid)))
    (setq board-subgrid (nreverse board-subgrid))
    (equal from-pattern board-subgrid)))

(defun reverse-rule (rule)
  "Reverse the transformation RULE."
  (let ((from-pattern (car rule))
        (to-pattern (cdr rule)))
    (cons to-pattern from-pattern)))

(defun previous-boards (rules board)
  "Return a list of previous positions of the game board."
  (let ((board-height (length board))
        (board-width (length (nth 0 board)))
        results)
    (dotimes (i board-height)
      (dotimes (j board-width)
        (dolist (rule rules)
          (if (check-rule rule i j board)
              (push (cons i j) results))))))
  )


(defun apply-rule (rule-id row col board)
  "Apply RULE-ID to the game board at row ROW and column COL. RULE-ID is an index in *my-game-rules*. ROW and COL are indices in *my-game-board*."
  (interactive "nRule ID: \nnRow: \nnCol: ")
  (let* ((rule (nth rule-id *my-game-rules*))
         (to-pattern (cdr rule))
         (pattern-height (length to-pattern))
         (pattern-width (length (car to-pattern)))
         (result (copy-tree board)))
    (if (check-rule rule row col board)
        (progn
          (dotimes (i pattern-height)
            (dotimes (j pattern-width)
              (setf (nth (+ col j)
                         (nth (+ row i)
                              result))
                    (nth j
                         (nth i to-pattern)))))
          (message "Rule applied."))
      (message "Cannot apply rule here."))
    result))

(defun my-game ()
  "Start my game."
  (interactive)
  (init-game '((A - - -)
               (- B - -)
               (- - A -)
               (- - A -))
             '((((A) (A)) . ((B) (B)))
               (((A A)) . ((B B)))
               (((A -) (A -)) . ((- A) (- A)))
               (((- A -) (- A -) (- A -)) . ((A - A) (A - A) (A - A)))
               (((B)) . ((-)))))
  (draw-board)
  (message "To move, call 'apply-rule' with the rule ID and coordinate of the cell to change."))

(defun game--run (game)
  "Start my game."
  (interactive)
  (init-game (car game) (cdr game))
  (draw-board)
  (message "To move, call 'apply-rule' with the rule ID and coordinate of the cell to change."))

(defun check-board-cleared ()
  "Check if the game board has been cleared."
  (not (cl-some #'(lambda (row)
                    (cl-some #'(lambda (cell)
                                 (eq cell 'A))
                             row))
                *my-game-board*)))

(defun game-run (game-id)
  "Start my game."
  (interactive "nGame ID: ")
  (game--run (nth game-id games)))

(defvar *my-game-level* 0)

(defvar *my-game-levels* nil)



(defun init-level ()
  "Initialize the current level."
  (init-game (car (nth *my-game-level* *my-game-levels*))
             (cdr (nth *my-game-level* *my-game-levels*)))
  (draw-board)
  (message "To move, call 'apply-rule' with the rule ID and coordinate of the cell to change."))

(defun game-levels-run (levels)
  "Start my game."
  (setq *my-game-level* 0)
  (setq *my-game-levels* (copy-tree some-levels))
  (init-level))

(defvar games
  '(
    (((A - A -)
      (- A - A)
      (A - A -)
      (- A - A))
     .
     ((((A - A)) . ((- - -)))
      (((- A -)) . ((A - A)))
      (((A) (-)) . ((-) (A)))
      (((-) (A)) . ((A) (-)))
      (((A A)) . ((- -)))))
    )
  )

(defvar some-levels
  '(
    (((A - A -)
      (- A - A)
      (A - A -)
      (- A - A))
     .
     ((((A - A)) . ((- - -)))
      (((- A -)) . ((A - A)))
      (((A) (-)) . ((-) (A)))
      (((-) (A)) . ((A) (-)))
      (((A A)) . ((- -)))))
    (((A - A A)
      (A A - A)
      (A - A -)
      (- A - A))
     .
     ((((A - A)) . ((- - -)))
      (((- A -)) . ((A - A)))
      (((A) (-)) . ((-) (A)))
      (((-) (A)) . ((A) (-)))
      (((A A)) . ((- -)))))
    ))

(provide 'game)
;;; game.el ends here
