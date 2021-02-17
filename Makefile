# Styles
YELLOW=$(shell echo "\033[00;33m")
RED=$(shell echo "\033[00;31m")
RESTORE=$(shell echo "\033[0m")

# Variables
YARN := yarn
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
	@$(YARN) install

.PHONY: serve
serve: ## Start the web server in DEV mode
	@$(YARN) start

.PHONY: buildassets-prod
buildassets-prod: ## Build Assets for prod
	@$(YARN) build

.PHONY: release
release: ## Release
	@$(YARN) build



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
	@ssh root@plopix.net 'su - plopix -c "cd /var/www/html/plopix/ganzhi/ganzhi.plopix.net && rm -rf var/cache"'
	@ssh root@plopix.net 'su - plopix -c "cd /var/www/html/plopix/ganzhi/ganzhi.plopix.net && yarn install && yarn run encore prod"'
