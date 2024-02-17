const stylistic = require('@stylistic/eslint-plugin');

const customized = stylistic.configs.customize({
    indent: 4,
    quotes: 'single',
    semi: true,
});

module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
        '@stylistic',
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@stylistic/recommended-extends',
    ],
    rules: {
        ...customized.rules,
        '@typescript-eslint/no-unused-vars': 'error',
    },
};
