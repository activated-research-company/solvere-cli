module.exports = {
  extends: [
    'airbnb',
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended",
  ],
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  rules: {
    'import/no-unresolved': 0,
    'import/extensions': 0,
    'class-methods-use-this': 0,
  },
};
