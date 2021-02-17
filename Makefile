# Styles
YELLOW=$(shell echo "\033[00;33m")
RED=$(shell echo "\033[00;31m")
RESTORE=$(shell echo "\033[0m")

# Variables
YARN := yarn
.DEFAULT_GOAL := list

.PHONY: list
list:
	@echo "*********************"
	@echo "${YELLOW}Available targets${RESTORE}:"
	@echo "*********************"
	@grep -E '^[a-zA-Z-]+:.*?## .*$$' Makefile | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "[32m%-15s[0m %s\n", $$1, $$2}'
	@echo "Docker Compose: ${YELLOW}$(DOCKER_COMPOSE)${RESTORE}"

.PHONY: install
install: ## Install the local project
	@$(YARN) install

.PHONY: serve
serve: ## Start the web server in DEV mode
	@$(YARN) start

.PHONY: release
release: ## Release for PROD
	@$(YARN) build

.PHONY: deploy
deploy:
	@rsync -avzCc --delete ./public/ root@plopix.net:/var/www/html/plopix/ganzhi/ganzhi.plopix.net/public2/
	@ssh root@plopix.net 'chown -R plopix:www-data /var/www/html/plopix/ganzhi/ganzhi.plopix.net/public2'
	@ssh root@plopix.net 'chmod -R 770 /var/www/html/plopix/ganzhi/ganzhi.plopix.net/public2'
