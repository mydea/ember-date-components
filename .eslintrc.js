module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  plugins: ['ember'],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended',
    'plugin:ember-suave/recommended',
    'plugin:prettier/recommended'
  ],
  env: {
    browser: true
  },
  rules: {},
  overrides: [
    // node files
    {
      files: [
        '.eslintrc.js',
        '.template-lintrc.js',
        '.eslintrc.js',
        'ember-cli-build.js',
        'testem.js',
        'blueprints/*/index.js',
        'config/**/*.js',
        'tests/dummy/config/**/*.js',
        'lib/*/index.js',
        'index.js'
      ],
      parserOptions: {
        sourceType: 'script',
        ecmaVersion: 2017
      },
      env: {
        browser: false,
        node: true
      }
    }
  ]
};
