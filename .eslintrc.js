module.exports = {
  env: {
    es6: true,
    jest: true,
    browser: true,
  },
  extends: ['react-app', 'react-app/jest'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    __DEV__: true,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'no-unused-vars': 'off',
    'no-console': ['error', { allow: ['tron'] }],
  },
}
