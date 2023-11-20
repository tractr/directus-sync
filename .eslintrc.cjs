/* eslint-env node */
module.exports = {
    ignorePatterns: ['dist/', 'node_modules/', '*.js', '*.cjs', '*.mjs'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended-type-checked',
        'plugin:@typescript-eslint/stylistic-type-checked',
        'prettier',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: [
            './packages/*/tsconfig.json',
        ]
    },
    plugins: ['@typescript-eslint'],
    root: true,
};
