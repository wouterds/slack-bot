# @jinxcapital/api

![code-review](https://github.com/jinxcapital/api/workflows/code-review/badge.svg)
![docker-image](https://github.com/jinxcapital/api/workflows/docker-image/badge.svg)
![deploy](https://github.com/jinxcapital/api/workflows/deploy/badge.svg)

## Setup

### Dependencies

```bash
# switch to correct node version
nvm install

# install dependencies
yarn

# start dev server
yarn dev
```


### VSCode

#### Plugins

- https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint

#### Workspace settings

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
  },
  "eslint.validate": [
    "javascript",
    "typescript",
  ],
}
```

## Linting

```bash
# lint
yarn lint

# automatically try to fix linting errors
yarn lint:fix
```

## Building

```bash
yarn build
```
