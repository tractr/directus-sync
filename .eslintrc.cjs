/* eslint-env node */
module.exports = {
    ignorePatterns: ['dist/', 'node_modules/', 'directus/', '*.js', '*.cjs', '*.mjs'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended-type-checked',
        'plugin:@typescript-eslint/stylistic-type-checked',
        'prettier',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: [
            './packages/*/tsconfig.eslint.json',
        ]
    },
    plugins: ['@typescript-eslint'],
    root: true,
    rules: {
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-misused-promises': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
    }
};

