module.exports = {
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'script',
  },
  env: {
    browser: true,
    jquery: false,
    es2021: true,
  },
  root: true,
  extends: ['plugin:prettier/recommended', 'prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        semi: false,
        singleQuote: true,
      },
    ],
  },
}
