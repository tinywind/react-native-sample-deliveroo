require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  plugins: ['node', 'prettier', 'react', 'jsx-a11y', 'react-hooks'],
  extends: ['@react-native-community', 'eslint:recommended', 'prettier', 'plugin:react/recommended', 'plugin:react-hooks/recommended'],
  parserOptions: {
    // "parser": "espree",
    allowImportExportEverywhere: true,
    sourceType: 'module',
    ecmaVersion: 'latest',
  },
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  globals: {
    JSX: true,
  },
  settings: {
    'eslint.validate': ['javascript', 'javascriptreact', 'typescript', 'typescriptreact', 'vue', 'markdown'],
    'editor.codeActionsOnSave': {
      'source.fixAll.eslint': true,
    },
    'import/resolver': {
      node: {
        paths: [''],
      },
    },
  },
  ignorePatterns: ['node_modules/'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        // @see https://heewon26.tistory.com/262
        endOfLine: 'auto',
        singleQuote: true,
        jsxSingleQuote: true,
        bracketSameLine: true,
        // preserve | always | never
        proseWrap: 'preserve',
        // as-needed | consistent | preserve
        quoteProps: 'as-needed',
        semi: true,
        tabWidth: 2,
        //trailingComma: all | es5 | none
        trailingComma: 'all',
        useTabs: false,
        printWidth: 200,
        //"parser": "babel",
        bracketSpacing: true,
        arrowParens: 'avoid',
      },
      { usePrettierrc: true },
    ],
    'no-param-reassign': 0,
    'no-shadow': 0,
    'no-unused-vars': 0,
    '@typescript-eslint/no-unused-vars': 0,
    'react-hooks/exhaustive-deps': 0,
    'react-native/no-inline-styles': 0,
    // eslint-plugin-react에서 제공하는 규칙
    'react/react-in-jsx-scope': 'off',
    // 'react/display-name': 'off',
    // 'react/jsx-key': 'error',
    // 'react/jsx-no-comment-textnodes': 'error',
    // 'react/jsx-no-duplicate-props': 'error',
    // 'react/jsx-no-target-blank': 'error',
    // eslint-plugin-react-hooks에서 제공하는 규칙
    // 'react-hooks/rules-of-hooks': 'error',
  },
};
