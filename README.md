# Node Context (Ctx)

Initial project setup for node

# .gitignore

- https://github.com/github/gitignore

# .gitattributes

- https://richienb.github.io/gitattributes-generator/
- select `Common` and `Web`

# .editorconfig

- get it from `root dir` of this `repo`

# Setup

## New Project

- First time setup

```sh
npm init
npm install -g pnpm@latest-10

# Things required to run
pnpm add -D typescript ts-node @types/node
pnpm add -D nodemon
pnpm add tslib

# Things required to format and linting
pnpm add -D eslint @eslint/eslintrc @eslint/js @typescript-eslint/parser @typescript-eslint/eslint-plugin
pnpm add -D prettier eslint-config-prettier eslint-plugin-prettier

# Common modules
pnpm add express ajv axios dotenv jsonwebtoken
pnpm add @types/express @types/jsonwebtoken -D

# Add husky
pnpm add -D husky lint-staged
pnpm exec husky init
```

- Pre commit

```sh
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm build
BUILD_STATUS=$?
if [ $BUILD_STATUS -ne 0 ]; then
  echo "Build failed. Commit aborted."
  exit 1
fi

pnpm lint-staged
```

# Docker build

```sh
docker compose build; docker compose down; docker compose up -d; docker logs --follow ctx-node-dev
docker compose build; docker compose down; docker compose up -d; docker logs --follow ctx-node-test
sudo docker compose build; sudo docker compose down; sudo docker compose up -d; sudo docker logs --follow ctx-node-prod
```

```sh
sudo docker logs --tail 0 --follow ctx-node-prod
```
