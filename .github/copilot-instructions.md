# Copilot Instructions for `campusrentalsystem`

## Current repository state (discovered)
- The workspace is currently empty (no source files, configs, or docs were found).
- No existing agent guidance files were found (`AGENTS.md`, `CLAUDE.md`, `.cursorrules`, etc.).
- No build, test, lint, or run commands are discoverable yet.

## What AI coding agents should do first in this repo
1. Treat this as a greenfield project until real code/config files are added.
2. Before implementing features, detect and follow whichever stack appears first:
   - `package.json` → Node/TypeScript workflow
   - `pyproject.toml` / `requirements.txt` → Python workflow
   - `pom.xml` / `build.gradle` → Java workflow
3. Keep changes minimal and avoid introducing assumptions about architecture not present in code.

## Instruction update policy for agents
- Re-check this file whenever major structure appears (for example: `src/`, `apps/`, `services/`, `api/`, `db/`).
- Update this document immediately after first framework setup with:
  - Actual build/test/lint/debug commands
  - Real module boundaries and data flow
  - Naming/style conventions seen in committed files
  - Integration points (DB, auth, message queues, external APIs)

## File references to prioritize once they exist
- Project entry docs: `README.md`, `docs/**`
- Build/config: `package.json`, `pyproject.toml`, `pom.xml`, `Dockerfile`, `docker-compose.yml`
- App structure: `src/**`, `apps/**`, `services/**`, `api/**`
- CI/CD and automation: `.github/workflows/**`, `Makefile`, task runner configs

## Important constraint
- Do **not** invent project-specific conventions until they are discoverable from real files in this repository.