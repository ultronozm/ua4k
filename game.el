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
(defvar *my-game-solution* nil)
(defvar *my-game-rule-dict* nil "Map from keys to transformation rules.")
(defvar *my-game-random* nil)

(defun symbol-to-char-symbols (sym)
  "Split a symbol into a list of character symbols."
  (mapcar #'intern (split-string (symbol-name sym) "" t)))

(defun char-symbols-to-symbol (sym-list)
  "Combine a list of symbols into a symbol."
  (intern (mapconcat #'symbol-name sym-list)))

(defun rule-list-from-dict (dict)
  "Return a list of rules from DICT."
  (cl-reduce #'append (mapcar #'cdr dict)))

(defun game-action (a)
  "Apply the I-th rule to the game board."
  (interactive)
  (let ((height (length *my-game-board*))
        (width (length (nth 0 *my-game-board*)))
        (rules (cdr (assoc a *my-game-rule-dict*))))
    (unless (cl-some (lambda (i)
                       (cl-some
                        (lambda (j)
                          (cl-some
                           (lambda (rule)
                             (when (check-rule rule i j *my-game-board*)
                               (setq *my-game-board*
                                     (apply-rule rule i j *my-game-board*))))
                           rules))
                        (number-sequence 0 (1- width))))
                     (number-sequence 0 (1- height)))
      (message "Cannot apply that rule.")))
  (draw-board)
  (if (check-board-cleared)
      (progn
        (message "Congratulations! You have cleared the board.")
        (setq *my-game-level* (1+ *my-game-level*))
        (if *my-game-random*
            (progn
              (setq *my-game-random* (1+ *my-game-random*))
              (let ((height (length *my-game-board*))
                    (width (length (nth 0 *my-game-board*))))
                (random-game height width *my-game-rule-dict* *my-game-random*)))
          (init-level))
        (if (< *my-game-level* (length *my-game-levels*))
            (init-level)
          (message "You have completed all levels.")))))

(defconst *game-keys* 'abcdefghijklmnopqrstuvwxyz1234567890)

(define-derived-mode my-game-mode special-mode "My Game"
  "Major mode for playing my game."
  (setq buffer-read-only t)
  ;; bind keys to apply-rule
  (dolist (a (symbol-to-char-symbols *game-keys*))
    (define-key my-game-mode-map (kbd (symbol-name a))
                (lambda ()
                  (interactive)
                  (game-action a)))))

(defun init-game (board rule-dict)
  "Initialize the game with a 2D list representing BOARD and a list of RULES."
  (setq *my-game-board* board)
  (setq *my-game-rule-dict* rule-dict)
  (switch-to-buffer "*My Game*")
  (my-game-mode)
  (draw-board))

(defun init-game-expand (abbr-board abbr-rule-dict)
  (init-game (expand-board abbr-board)
             (expand-rule-dict abbr-rule-dict)))

(defun draw-board ()
  "Draw the game board in a new buffer."
  (let ((buffer (get-buffer-create "*My Game*")))
    (with-current-buffer buffer
      (let ((old-point (point))
            (inhibit-read-only t))
        (erase-buffer)
        ;; (insert "  ")
        ;; (dotimes (j (length (nth 0 *my-game-board*)))
        ;;   (insert (format "%s" j)))
        ;; (insert "\n")
        (dotimes (i (length *my-game-board*))
          ;; (insert (format "%s " i))
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
        (when *my-game-random*
          (insert (format "\nDepth: %s\n" *my-game-random*)))
        (insert "\nAvailable transformations:\n")
        (insert-rule-dict *my-game-rule-dict*)
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
                          board))
                subgrid-row))
        (push (nreverse subgrid-row) board-subgrid)))
    (setq board-subgrid (nreverse board-subgrid))
    (equal from-pattern board-subgrid)))

(defun reverse-rule (rule)
  "Reverse the transformation RULE."
  (let ((from-pattern (car rule))
        (to-pattern (cdr rule)))
    (cons to-pattern from-pattern)))

(defun previous-moves (rules board)
  "Return a list of previous positions of the game board.
Also return the rule applied to get there."
  (let ((board-height (length board))
        (board-width (length (nth 0 board)))
        results)
    (dotimes (i board-height)
      (dotimes (j board-width)
        (dotimes (k (length rules))
          (let ((rule (nth k rules)))
            (let ((reversed-rule (reverse-rule rule)))
              (if (check-rule reversed-rule i j board)
                  (push (cons (apply-rule reversed-rule i j board) k) results)))))))
    results))

(defun random-path (depth rules board-path)
  "Return a random previous position of the game board."
  (if (zerop depth)
      board-path
    (let* ((path (random-path (1- depth) rules board-path))
           (moves (previous-moves rules (car path)))
           (allowed-rules (cl-remove-duplicates (mapcar #'(lambda (move) (cdr move)) moves))))
      (when (> (length allowed-rules) 0)
        (let* ((chosen-rule (nth (random (length allowed-rules)) allowed-rules))
               (moves-with-chosen-rule (cl-remove-if-not #'(lambda (move) (eq (cdr move) chosen-rule)) moves))
               (move (nth (random (length moves-with-chosen-rule)) moves-with-chosen-rule)))
          (cons (car move) (cons (cdr move) (cdr path))))))))

(defun random-game (height width rule-dict depth)
  (setq *my-game-random* depth)
  (let* ((board (empty-board height width))
         (path (random-path depth
                            (rule-list-from-dict rule-dict)
                            (cons board nil))))
    ;; (setq *my-game-solution*
    ;;       (mapconcat
    ;;        (lambda (i)
    ;;          (substring *key-string* i (+ i 1)))
    ;;        (cdr path)))
    (init-game (car path) rule-dict)))

(defun empty-board (height width)
  "Return the empty game board of given HEIGHT and WIDTH."
  (let (result)
    (dotimes (i height)
      (let (row)
        (dotimes (j width)
          (push '- row))
        (push row result)))
    result))

(defun apply-rule (rule row col board)
  "Apply RULE to the game board at row ROW and column COL."
  (interactive "nRule ID: \nnRow: \nnCol: ")
  (let* ((to-pattern (cdr rule))
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

(defun check-board-cleared ()
  "Check if the game board has been cleared."
  (not (cl-some #'(lambda (row)
                    (cl-some #'(lambda (cell)
                                 (not (eq cell '-)))
                             row))
                *my-game-board*)))

(defvar *my-game-level* 0)

(defvar *my-game-levels* nil)

(defun init-level ()
  "Initialize the current level."
  (init-game (car (nth *my-game-level* *my-game-levels*))
             (cdr (nth *my-game-level* *my-game-levels*)))
  (draw-board)
  (message "To move, call 'apply-rule' with the rule ID and coordinate of the cell to change."))

(defun expand-board (abbr-board)
  (mapcar #'symbol-to-char-symbols abbr-board))

(defun expand-rule (abbr-rule)
  (let ((src (car abbr-rule))
        (dst (cdr abbr-rule)))
    (cons
     (mapcar #'symbol-to-char-symbols src)
     (mapcar #'symbol-to-char-symbols dst))))

(defun expand-rule-dict (abbr-rule-dict)
  (mapcar (lambda (x)
            (cons (car x)
                  (mapcar #'expand-rule (cdr x))))
          abbr-rule-dict))

(defvar my-board
  '(---X
    -A-A
    --A-))

;; take into account horizontal/vertical space
(defun insert-rule-dict (rule-dict)
  (dolist (x rule-dict)
    (insert (format "%s:\n" (car x)))
    (dolist (rule (cdr x))
      (insert "==================\n")      
      (let ((height (length (car rule)))
            (half-height (/ (length (car rule)) 2)))
        (dotimes (i height)
          (insert (format "%s   %s   %s\n" (nth i (car rule))
                          (if (eq i half-height) "->" "  ")
                          (nth i (cdr rule)))))
        ))
    (insert "==================\n\n")))

(defvar my-rule-dict
  '((w .
       (((-
          X)
         . (X
            -))
        ((-
          A
          X)
         . (A
            X
            -))))
    (s .
       (((X
          -)
         . (-
            X))
        ((X
          A
          -)
         . (-
            X
            A))))
    (a .
       (((-X)
         . (X-))
        ((-AX)
         . (AX-))))
    (d .
       (((X-)
         . (-X))
        ((XA-)
         . (-XA))))))


;; https://stackoverflow.com/questions/42251315/a-safe-way-to-transpose-a-list-of-of-lists-in-lisp
(defun pop-all (list-of-lists)
  "Pop each list in the list, return list of pop results
and an indicator if some list has been exhausted."
  (cl-loop for tail on list-of-lists collect (pop (car tail))))
(defun transpose (list-of-lists)
  "Transpose the matrix."
  (cl-loop with tails = (cl-copy-list list-of-lists)
           while (cl-some #'consp tails) ; or any?
           collect (pop-all tails)))

;; e.g., east = '(*-)
(defun rotate-west (east)
  (let* ((array (mapcar #'symbol-to-char-symbols east))
         (flipped-horiz (mapcar #'nreverse array))
         (rotated-180 (nreverse flipped-horiz)))
    (mapcar #'char-symbols-to-symbol rotated-180)))

(defun rotate-north (east)
  (let* ((array (mapcar #'symbol-to-char-symbols east))
         (flipped-horiz (mapcar #'nreverse array))
         (rotated (transpose flipped-horiz)))
    (mapcar #'char-symbols-to-symbol rotated)))

(defun rotate-south (east)
  (let* ((array (mapcar #'symbol-to-char-symbols east))
         (flipped (nreverse array))
         (rotated (transpose flipped)))
    (mapcar #'char-symbols-to-symbol rotated)))

(defun play-sokoban (&optional board)
  (interactive)
  (unless board
    (setq board
          '(XX---X
            O*a--X
            XX-aOX
            OXXa-X
            -X-O-X
            a-AaaO
            ---O--)))
  (let* ((rules-east
          '(((*-)
             . (-*))
            ((!-)
             . (O*))
            ((*O)
             . (-!))
            ((*a-)
             . (-*a))
            ((*aO)
             . (-*A))
            ((*A-)
             . (-!a))
            ((!a-)
             . (O*a))
            ((!aO)
             . (O*A))
            )
          )
         (rules-dict
          `((w . ,(maprules #'rotate-north my-rules-east))
            (s . ,(maprules #'rotate-south my-rules-east))
            (a . ,(maprules #'rotate-west my-rules-east))
            (d . ,my-rules-east))))
    (init-game-expand board rules-dict)))

(defun play-sokoban-2 (&optional board)
  (interactive)
  (unless board
    (setq board
          '(WW--bW
            Oax--W
            WW-xOW
            OWWx-W
            -W-O-W
            x-XxxO
            ---O--)))
  (let* ((p1-east
          '(((a-)
             . (-a))
            ((A-)
             . (Oa))
            ((aO)
             . (-A))
            ((ax-)
             . (-ax))
            ((axO)
             . (-aX))
            ((aX-)
             . (-Ax))
            ((Ax-)
             . (Oax))
            ((AxO)
             . (OaX))
            )
          )
         (p2-east
          '(((b-)
             . (-b))
            ((B-)
             . (Ob))
            ((bO)
             . (-B))
            ((bx-)
             . (-bx))
            ((bxO)
             . (-bX))
            ((bX-)
             . (-Bx))
            ((Bx-)
             . (Obx))
            ((BxO)
             . (ObX))
            )
          )
         (rules-dict
          `((w . ,(maprules #'rotate-north p1-east))
            (s . ,(maprules #'rotate-south p1-east))
            (a . ,(maprules #'rotate-west p1-east))
            (d . ,p1-east)
            (i . ,(maprules #'rotate-north p2-east))
            (k . ,(maprules #'rotate-south p2-east))
            (j . ,(maprules #'rotate-west p2-east))
            (l . ,p2-east))))
    (init-game-expand board rules-dict)))

(defun play-fifteen (&optional board)
  (interactive)
  (unless board
    (setq board
          '(c12f
            b658
            7a94
            *de3)))
  (let* ((rules-east
          (mapcar
           (lambda (a)
             (cons
              (list (char-symbols-to-symbol (list a '*)))
              (list (char-symbols-to-symbol (list '* a)))))
           '(\1 \2 \3 \4 \5 \6 \7 \8 \9 a b c d e f)))
         (rules-dict
          `((w . ,(maprules #'rotate-north rules-east))
            (s . ,(maprules #'rotate-south rules-east))
            (a . ,(maprules #'rotate-west rules-east))
            (d . ,rules-east))))
    (init-game-expand board rules-dict)))


(defun maprules (f rules)
  (mapcar (lambda (x)
            (cons (funcall f (car x))
                  (funcall f (cdr x))))
          rules))


(defvar my-rule-dict-2-old
  '((z .
       (((-*-)
         . (*-*))))
    (x .
       (((*-*)
         . (-*-))))
    (w .
       (((-
          *)
         . (*
            -))
        ((-
          !)
         . (*
            O))
        ((-
          a
          *)
         . (a
            *
            -))
        ((O
          a
          *)
         . (A
            *
            -))
        ((-
          A
          *)
         . (a
            !
            -))))
    (s .
       (((*
          -)
         . (-
            *))
        ((!
          -)
         . (-
            *))
        ((*
          a
          -)
         . (-
            *
            a))
        ((*
          a
          O)
         . (-
            *
            A))
        ((*
          A
          -)
         . (-
            !
            a))))
    (a .
       (((-*)
         . (*-))
        ((-!)
         . (*-))
        ((-a*)
         . (a*-))
        ((Oa*)
         . (A*-))
        ((-A*)
         . (a!-))
        ((-A*)
         . (a!-))))
    (d .
       (((*-)
         . (-*))
        ((!-)
         . (-*))
        ((*a-)
         . (-*a))
        ((*aO)
         . (-*A))
        ((*A-)
         . (-!a))
        ((*A-)
         . (-!a))))))




(provide 'game)
;;; game.el ends here
