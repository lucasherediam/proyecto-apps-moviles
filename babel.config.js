module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            [
                'module-resolver',
                {
                    root: ['./'],
                    alias: {
                        '@constants': './constants',
                        '@components': './components',
                        '@assets': './assets',
                        '@context': './context',
                        '@data': './data',
                    },
                },
            ],
        ],
    };
};
