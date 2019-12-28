module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-trailing-spaces': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'comma-dangle': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unused-vars': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-empty': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'padded-blocks': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'import/prefer-default-export': 'off',
    'no-multi-spaces': 'off',
    'prefer-destructuring': 'off',
    'camelcase': 'off',
    'prefer-template': 'off',
    'space-before-blocks': 'off',
    'quotes': 'off',
    'arrow-body-style': 'off',
    'eol-last': 'off',
    'space-in-parens': 'off',
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
