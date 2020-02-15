# Styles
YELLOW=$(shell echo "\033[00;33m")
RED=$(shell echo "\033[00;31m")
RESTORE=$(shell echo "\033[0m")

# Variables
PORT_PREFIX := 14
PHP := php
SYMFONY := symfony
YARN := yarn
COMPOSER := composer
SRCS := src

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
	@$(COMPOSER) install
	@$(YARN) install

.PHONY: serve
serve: clean stop ## Start the web server in DEV mode, HTTPS
	@$(SYMFONY) local:server:start --port=$(PORT_PREFIX)080 -d

.PHONY: stop
stop: ## Stop web server if running
	@$(SYMFONY) local:server:stop

.PHONY: watch
watch: ## Run Assets Build watch (blocking)
	@$(YARN) run encore dev --watch

.PHONY: buildassets-dev
buildassets-dev: ## Build Assets for dev
	$(YARN) run encore dev

.PHONY: buildassets-prod
buildassets-prod: ## Build Assets for prod
	$(YARN) run encore prod

.PHONY: clean
clean: ## Clean cache
	@cd $(APP_DIR) && rm -rf var/cache/*

.PHONY: deploy
deploy:
	@rsync -avzCc --delete \
			--exclude="vendor/" \
			--exclude="var/" \
			--exclude=".composer/" \
			--exclude="node_modules/" \
			--exclude="public/build/" \
			--exclude=".env.local" \
			--exclude=".idea" \
			./ root@plopix.net:/var/www/html/plopix/ganzhi/ganzhi.plopix.net/

	@ssh root@plopix.net 'chown -R plopix:www-data /var/www/html/plopix/ganzhi/ganzhi.plopix.net/'
	@ssh root@plopix.net 'chmod -R 770 /var/www/html/plopix/ganzhi/ganzhi.plopix.net/'
	@ssh root@plopix.net 'su - plopix -c "cd /var/www/html/plopix/ganzhi/ganzhi.plopix.net && composer install"'
	@ssh root@plopix.net 'su - plopix -c "cd /var/www/html/plopix/ganzhi/ganzhi.plopix.net && yarn install && yarn run encore prod"'
