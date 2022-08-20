Web开发常用配置

# 安装

```bash
npm install -g @chiyan-dev/web-configs
# 或者
yarn global add @chiyan-dev/web-configs
```

# 使用

## Eslint 使用示例

```javascript
// .eslint.js
module.exports = {
  extends: [require.resolve('@chiyan-dev/web-configs/dist/eslint.js')],

  globals: {
    // global variables
  },

  rules: {
    // your rules
  },
};

```

## Prettier 使用示例

```javascript
// .prettierrc.js
const projectConfig = require('@chiyan-dev/web-configs');

module.exports = {
  ...projectConfig.prettier,
};
```

## TSConfig 使用示例

`tsconfig.json`

``` JSON
{
  "extends": "./node_modules/@chiyan-dev/web-configs/static/tsconfig-nodejs.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "baseUrl": "src"
  }
}

```