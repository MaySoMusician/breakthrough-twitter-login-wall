module.exports = {
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'script',
  },
  env: {
    browser: true,
    jquery: true,
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
