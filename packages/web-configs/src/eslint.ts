module.exports = {
  extends: [
    require.resolve('eslint-config-alloy/index.js'),
    require.resolve('eslint-config-alloy/react.js'),
    require.resolve('eslint-config-alloy/typescript.js'),
  ],
  plugins: ['prettier'],
  env: {
    browser: true,
    node: true,
  },
  rules: {
    'prettier/prettier': 'error',
    /**
     * 建议变量的命名规则
     */
    '@typescript-eslint/naming-convention': [
      'warn',
      {
        selector: 'default',
        format: ['camelCase'],
        leadingUnderscore: 'allow',
        trailingUnderscore: 'allow',
      },

      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        leadingUnderscore: 'allow',
        trailingUnderscore: 'allow',
      },

      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },

      {
        selector: 'function',
        format: ['PascalCase', 'camelCase'],
      },

      {
        selector: 'property',
        format: ['UPPER_CASE', 'camelCase'],
      },
    ],
    /**
     * 使用 import type 导入类型
     */
    '@typescript-eslint/consistent-type-imports': ['error'],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
