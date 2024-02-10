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
(defvar *my-game-rule-dict* nil "Map from keys to transformation rules.")
(defvar *my-game-level* 0)
(defvar *my-game-boards* nil)
(defvar *my-game-win-condition* nil)

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
  (when (funcall *my-game-win-condition* *my-game-board*)
    (progn
      (message "Congratulations! You have cleared the board.")
      (setq *my-game-level* (1+ *my-game-level*))
      (init-level)
      (if (< *my-game-level* (length *my-game-boards*))
          (init-level)
        (message "You have completed all levels.")))))

(defconst *game-keys* 'abcdefghijklmnopstuvwxyz1234567890)




(define-derived-mode my-game-mode special-mode "My Game"
  "Major mode for playing my game."
  (setq buffer-read-only t)
  ;; bind keys to apply-rule
  (dolist (a (symbol-to-char-symbols *game-keys*))
    (define-key my-game-mode-map (kbd (symbol-name a))
                (lambda ()
                  (interactive)
                  (game-action a))))
  (define-key my-game-mode-map (kbd "r")
              (lambda ()
                (interactive)
                (init-level))))

(defun init-game (board rule-dict)
  "Initialize the game with a 2D list representing BOARD and a list of RULES."
  (setq *my-game-board* board)
  (setq *my-game-rule-dict* rule-dict)
  (switch-to-buffer "*My Game*")
  (my-game-mode)
  (draw-board))

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
        (when *my-game-level* (insert (format "\nLevel %s.\n" *my-game-level*)))
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
     (<= (+ row pattern-height)
         (length board))
     (<= (+ col pattern-width)
         (length (nth 0 board))))
    (dotimes (i pattern-height)
      (let (subgrid-row)
        (dotimes (j pattern-width)
          (push (nth (+ col j)
                     (nth (+ row i)
                          board))
                subgrid-row))
        (push (nreverse subgrid-row)
              board-subgrid)))
    (setq board-subgrid (nreverse board-subgrid))
    ;; (equal from-pattern board-subgrid)
    (cl-every
     (lambda (i)
       (cl-every
        (lambda (j)
          (let ((cell (nth j (nth i from-pattern)))
                (board-cell (nth j (nth i board-subgrid))))
            (or (eq cell '\?)
                (eq cell board-cell))))
        (number-sequence 0 (1- pattern-width))))
     (number-sequence 0 (1- pattern-height)))))

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
              (let ((cell (nth j (nth i to-pattern))))
                (when (not (eq cell '\?))
                  (setf (nth (+ col j)
                             (nth (+ row i)
                                  result))
                        cell)))))
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

(defun init-level ()
  "Initialize the current level."
  (init-game (nth *my-game-level* *my-game-boards*)
             *my-game-rule-dict*))

(defun init-game-series (boards rule-dict win-condition &optional initial-level)
  (setq *my-game-boards* (copy-tree boards))
  (setq *my-game-rule-dict* rule-dict)
  (setq *my-game-win-condition* win-condition)
  (setq *my-game-level* (or initial-level 0))
  (init-level))


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

(defun board-contains-w-p (board)
  (cl-some
   (lambda (row)
     (cl-some
      (lambda (cell)
        (eq cell 'w))
      row))
   board))

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
    (init-game (expand-board board) (expand-rule-dict rules-dict) #'board-contains-w-p)))

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
    (init-game (expand-board board) (expand-rule-dict rules-dict))))

(defun dart-game-boards ()
  '((-----
     >a--o
     -----)
    (-----
     >-xao
     -----)
    (/---\\
     -----
     o----
     >a--/)
    (oa-\\
     --/-
     >---)
    (a--o
     \\-/-
     ---<)
    (o--x-
     x-\\-x
     >-a/-)
    (x-o---
     x-x\\x-
     >-a/--
     x-----)
    (x----
     -x-x-
     ox\\-x
     >-a/-)
    (-x----
     oxx\\/-
     -x-a--
     ------
     >-x---
     x---xx)
    (-xx---
     oxx\\/-
     -x-a--
     ------
     >-x---
     ----xx)
    (a-----o
     -/---\\-
     --SUP--
     >\\---x-
     -------)
    ))

(defun dart-game-rules ()
  (let ((p1-east
         '(((a-)
            . (-a))
           ((A-)
            . (Oa))
           ((aO)
            . (-A))
           ((a/-)
            . (-a/))
           ((a\\-)
            . (-a\\))
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
         ))
    `((w . ,(maprules #'rotate-north p1-east))
      (s . ,(maprules #'rotate-south p1-east))
      (a . ,(maprules #'rotate-west p1-east))
      (d . ,p1-east)
      (z . (((>-)
             . (->))
            ((-<)
             . (<-))
            ((v
              -)
             . (-
                v))
            ((-
              ^)
             . (^
                -))
            
            ((\?-
              >/)
             . (\?^
                -/))
            ((>\\
              \?-)
             . (-\\
                \?v))
            
            ((-?
              \\<)
             . (^?
                \\-))
            ((/<
              -?)
             . (/-
                v?))
            
            ((/-
              ^?)
             . (/>
                -?))
            ((-\\
              \?^)
             . (<\\
                \?-))
            
            ((v?
              \\-)
             . (-?
                \\>))
            ((\?v
              -/)
             . (\?-
                </))

            ((>\\
              -/)
             . (-\\
                </))
            ((-\\
              >/)
             . (<\\
                -/))
            ((/-
              \\<)
             . (/>
                \\-))
            ((/<
              \\-)
             . (/-
                \\>))
            ((v-
              \\/)
             . (-^
                \\/))
            ((-v
              \\/)
             . (^-
                \\/))
            ((/\\
              ^-)
             . (/\\
                -^))
            ((/\\
              -^)
             . (/\\
                ^-))
            
            
            ((>o)
             . (-w))
            ((o<)
             . (w-))
            ((o
              ^)
             . (w
                -))
            ((v
              o)
             . (-
                w))
            ))
      )
    )
  )

(defun play-sokoban-with-dart ()
  (interactive)
  (let* ((initial-level 10)
         (boards
          (dart-game-boards))
         (rules-dict (dart-game-rules)))
    (export-game-series (mapcar #'expand-board boards) (expand-rule-dict rules-dict))
    (init-game-series (mapcar #'expand-board boards) (expand-rule-dict rules-dict) #'board-contains-w-p initial-level)))

(defun enumerate (lst)
  (let ((i -1)) ; start from -1 because we ++ it before using
    (cl-loop for item in lst collect (cons (cl-incf i) item))))

(defun export-game-series (boards rule-dict)
  "Export boards and rules."
  (let ((boards-json (json-encode (vconcat boards)))
        (rules-json (json-encode
                     (mapcar
                      (lambda (item)
                        (cons (car item)
                              (mapcar
                               (lambda (rule)
                                 (vconcat
                                  (list (car rule) (cdr rule))
                                  ))
                               (cdr item))))
                      rule-dict))))
    (with-temp-buffer
      (insert (format "boards = %s\n" boards-json))
      (insert (format "rules = %s\n" rules-json))
      (write-file "output.txt"))))

(defun play-fifteen (&optional board)
  (interactive)
  (unless board
    (setq board
          '(c12f
            b658
            7a94
            xde3)))
  (let* ((rules-east
          (mapcar
           (lambda (a)
             (cons
              (list (char-symbols-to-symbol (list a 'x)))
              (list (char-symbols-to-symbol (list 'x a)))))
           '(\1 \2 \3 \4 \5 \6 \7 \8 \9 a b c d e f)))
         (rules-dict
          `((w . ,(maprules #'rotate-north rules-east))
            (s . ,(maprules #'rotate-south rules-east))
            (a . ,(maprules #'rotate-west rules-east))
            (d . ,rules-east))))
    (init-game (expand-board board) (expand-rule-dict rules-dict))))


(defun maprules (f rules)
  (mapcar (lambda (x)
            (cons (funcall f (car x))
                  (funcall f (cdr x))))
          rules))


(provide 'game)
;;; game.el ends here
