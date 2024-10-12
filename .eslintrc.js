// https://docs.expo.dev/guides/using-eslint/
module.exports = {
    extends: ['expo', 'eslint-config-prettier'],
    plugins: ['prettier', 'import'],
    rules: {
        'prettier/prettier': ['error', { tabWidth: 4, useTabs: false }],
        'react/react-in-jsx-scope': 'off',
        'import/no-unresolved': 'error',
        indent: ['error', 4],
    },
    settings: {
        'import/resolver': {
            'babel-module': {},
        },
    },
};
