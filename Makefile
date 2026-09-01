.PHONY: check check-emacs pacman-checks parser-diagnostics capture-adversarial wildcard-adversarial rewrites-acceptance pacman-balance pacman-mover-acceptance snapshots build-check site-check scratch-smoke solve-smoke verify-minmoves refresh-snapshots build-site build-web build-emacs clean-generated

CHECK_DIST ?= /tmp/ua4k-dist-check
CHECK_SITE ?= /tmp/ua4k-site-check

check: parser-diagnostics pacman-checks capture-adversarial wildcard-adversarial pacman-mover-acceptance pacman-balance snapshots build-check site-check scratch-smoke solve-smoke verify-minmoves

parser-diagnostics:
	python3 parser_diagnostics.py
	python3 tests/capture_diagnostics.py

capture-adversarial:
	node tests/capture_adversarial.js

wildcard-adversarial:
	node tests/wildcard_adversarial.js

pacman-mover-acceptance:
	python3 tests/pacman_mover_acceptance.py

snapshots:
	python3 golden_snapshots.py check

build-check:
	python3 build-all-assets.py -o "$(CHECK_DIST)"

site-check:
	python3 build-site.py -o "$(CHECK_SITE)"

scratch-smoke:
	@set -e; for file in games/featured/*.txt games/polished/*.txt games/clones/*.txt games/toys/*.txt; do \
		name=$$(basename "$$file" .txt); \
		echo "scratch smoke: $$name"; \
		node scratch_smoke.js "$$file" >/dev/null; \
	done

solve-smoke:
	node solve_level.js game 0 20 50000

verify-minmoves:
	node verify_minmoves.js

# Native tests for the Emacs runtime. Kept out of the default `check` so the
# toolchain contract is unchanged for contributors without Emacs.
check-emacs:
	emacs -Q --batch -L emacs -l ua4k-tests -f ert-run-tests-batch-and-exit

refresh-snapshots:
	python3 golden_snapshots.py refresh

build-site:
	python3 build-site.py

build-web:
	python3 build-web.py dockstep crash-landing game

build-emacs:
	python3 build-emacs-assets.py dockstep crash-landing game

clean-generated:
	rm -rf dist site web-build emacs-build "$(CHECK_DIST)" "$(CHECK_SITE)"

rewrites-acceptance:
	python3 tests/rewrites_acceptance.py

# Seeded two-policy pacman balance gate.
pacman-balance:
	node tests/pacman-tests.js autopilot

pacman-checks:
	node tests/pacman-tests.js
	python3 tests/pacman_maze_check.py
