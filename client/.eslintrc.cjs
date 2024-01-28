module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
    ],
    ignorePatterns: ['dist', '.eslintrc.cjs'],
    parser: '@typescript-eslint/parser',
    plugins: ['react-refresh'],
    rules: {
        'react-refresh/only-export-components': [
            'off', // https://github.com/shadcn-ui/ui/issues/1534
            { allowConstantExport: true },
        ],
    },
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json', './tsconfig.node.json'],
        tsconfigRootDir: __dirname,
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
    // https://github.com/shadcn-ui/ui/issues/120#issuecomment-1828081539
    overrides: [
        {
            files: ['**/components/ui/*.tsx'],
            rules: {
                'react/prop-types': [2, { ignore: ['className'] }],
                'react-refresh/only-export-components': 'off',
            },
        },
    ],
}
