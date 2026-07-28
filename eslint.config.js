const { defineConfig, globalIgnores } = require("eslint/config");
const prettier = require("eslint-plugin-prettier");
const packageJson = require("eslint-plugin-package-json");
const markdownlintConfig = require('./.markdownlint.json');
const jsoncEslintParser = require('jsonc-eslint-parser');
const typescriptEslintParser = require('@typescript-eslint/parser');
const eslintPluginMarkdownlintParser = require('eslint-plugin-markdownlint/parser').default;

module.exports = defineConfig([
    globalIgnores(['node_modules/**/*', 'dist/**/*', 'coverage/**/*', '.stryker-tmp/**/*']),
    {
      files: ['**.md'],
      languageOptions: {
        parser: eslintPluginMarkdownlintParser,
      },
      /**
       * eslint-plugin-markdownlint currently does not support configuration files. We currently
       * configure markdownlint using the markdownlint.json file.
       *
       * @see    https://https://www.npmjs.com/package/eslint-plugin-markdownlint, Limitations section
       * @author Elizabeth B. Clouser-Kuhn <clouser.elizabeth@protonmail.com>
       */
      rules: Object.entries(markdownlintConfig).filter(([_k, v]) => !v).reduce((a, [b]) => {
        return Object.assign(a, { [`markdownlint/${b.toLowerCase()}`]: 'off' });
      }, {})
    },
    {
      plugins: {prettier},
      files: ['src/**/*.ts', 'assembly/**/*.ts'],
      languageOptions: {
        parser: typescriptEslintParser,
        globals: {
          browser: true,
          es2020: true,
          jest: true,
        },
      },
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        'object-curly-newline': 'off',
        'operator-linebreak': 'off',
        'no-confusing-arrow': 'off',
        'implicit-arrow-linebreak': 'off',
        'function-paren-newline': 'off',
        'no-unsafe-optional-chaining': 'off',
        'no-useless-escape': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'class-methods-use-this': 'off',
        'no-use-before-define': 'off',
        'no-shadow': 'off',
      },
    },
    {
      extends: [packageJson.configs.recommended],
      files: ['package.json'],
      languageOptions: {
        parser: jsoncEslintParser,
        parserOptions: {
          extraFileExtensions: ['.json'],
        },
      },
      plugins: {packageJson},
      rules: {
        'package-json/require-description': 'off',
        'package-json/valid-version': 'error',
        'package-json/require-license': 'off',
        'package-json/require-type': 'off',
        'package-json/require-exports': 'off',
        'package-json/require-files': 'off',
        'package-json/require-sideEffects': 'off',
        'package-json/require-attribution': 'off',
      },
    },
]);
