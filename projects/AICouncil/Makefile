.PHONY: help install dev prod down clean test lint format docker-build docker-push

help:
	@echo "AICouncil Development Commands"
	@echo "=============================="
	@echo ""
	@echo "Setup:"
	@echo "  make install       Install all dependencies"
	@echo ""
	@echo "Development:"
	@echo "  make dev          Start development stack (docker-compose up)"
	@echo "  make down         Stop all services"
	@echo "  make clean        Clean everything (containers, volumes, node_modules)"
	@echo ""
	@echo "Testing:"
	@echo "  make test         Run all tests"
	@echo "  make test-js      Run JavaScript tests only"
	@echo "  make test-py      Run Python tests only"
	@echo ""
	@echo "Code Quality:"
	@echo "  make lint         Lint all code (JS + Python)"
	@echo "  make format       Format all code (JS + Python)"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-build   Build all Docker images"
	@echo "  make docker-push    Push images to registry"
	@echo ""
	@echo "Production:"
	@echo "  make prod         Start production stack"
	@echo ""

install:
	npm install
	pip install -e .

dev:
	docker compose -f deploy/docker/docker-compose.dev.yml up

prod:
	docker compose -f deploy/docker/docker-compose.yml up -d

down:
	docker compose down

clean:
	docker compose down -v
	rm -rf node_modules dist build .next .pytest_cache
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete

test: test-js test-py

test-js:
	npm test

test-py:
	pytest services middleware -v --cov

lint: lint-js lint-py

lint-js:
	npm run lint

lint-py:
	flake8 services middleware
	mypy services middleware

format: format-js format-py

format-js:
	npm run format

format-py:
	black services middleware
	isort services middleware

docker-build:
	docker compose -f deploy/docker/docker-compose.yml build

docker-push:
	docker compose -f deploy/docker/docker-compose.yml push

logs:
	docker compose logs -f

logs-council:
	docker compose logs -f council

logs-litellm:
	docker compose logs -f litellm

ps:
	docker compose ps

shell-council:
	docker compose exec council bash

shell-python:
	docker compose exec council python

docs:
	@echo "Opening documentation..."
	@open docs/ARCHITECTURE.md || xdg-open docs/ARCHITECTURE.md

.DEFAULT_GOAL := help
