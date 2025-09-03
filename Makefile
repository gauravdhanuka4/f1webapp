# Makefile for f1webapp

.PHONY: build up down logs logs-be logs-fe rebuild

build:
	docker-compose build --no-cache

build-be:
	docker-compose build --no-cache backend

build-fe-dev:
	NODE_ENV=development docker-compose build --no-cache frontend

up:
	docker-compose up -d   # run in detached mode

up-be:
	docker-compose up -d --build --no-cache backend

up-fe-dev:
	NODE_ENV=development docker-compose build --no-cache frontend
	NODE_ENV=development docker-compose up -d frontend

up-fe-prod:
	NODE_ENV=production docker-compose build --no-cache frontend
	NODE_ENV=production docker-compose up -d frontend

down:
	docker-compose down

logs:
	docker-compose logs -f

logs-be:
	docker-compose logs -f backend

logs-fe:
	docker-compose logs -f frontend

rebuild-be:
	docker-compose down backend
	up-be

rebuild-fe-dev:
	docker-compose down frontend
	up-fe-dev

rebuild-dev:
	rebuild-be
	rebuild-fe-dev

production:
	docker-compose down
	up-be
	up-fe-prod

fresh:
	docker-compose down --rmi all --volumes --remove-orphans
	docker-compose build --no-cache
	docker-compose up -d