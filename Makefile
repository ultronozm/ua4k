.PHONY: check parser-diagnostics snapshots build-check site-check scratch-smoke solve-smoke refresh-snapshots build-site build-web build-emacs clean-generated

CHECK_DIST ?= /tmp/ua4k-dist-check
CHECK_SITE ?= /tmp/ua4k-site-check

check: parser-diagnostics snapshots build-check site-check scratch-smoke solve-smoke

parser-diagnostics:
	python3 parser_diagnostics.py

snapshots:
	python3 golden_snapshots.py check

build-check:
	python3 build-all-assets.py -o "$(CHECK_DIST)"

site-check:
	python3 build-site.py -o "$(CHECK_SITE)"

scratch-smoke:
	@for file in games/polished/*.txt games/toys/*.txt; do \
		name=$$(basename "$$file" .txt); \
		echo "scratch smoke: $$name"; \
		node scratch_smoke.js "$$name" >/dev/null; \
	done

solve-smoke:
	node solve_level.js game 0 20 50000

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
