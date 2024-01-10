const webpack = require('webpack');
const WorkBoxPlugin = require('workbox-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');

module.exports = function override(config) {
    config.resolve.fallback = {
        process: require.resolve('process/browser'),
        stream: require.resolve('stream-browserify'),
        crypto: require.resolve('crypto-browserify'),
        util: require.resolve('util'),
        buffer: require.resolve('buffer'),
        path: require.resolve('path-browserify'), // 添加这行
        os: require.resolve('os-browserify/browser') // 添加这行
    };

    // https://stackoverflow.com/questions/69135310/workaround-for-cache-size-limit-in-create-react-app-pwa-service-worker
    config.plugins.forEach((plugin) => {
        if (plugin instanceof WorkBoxPlugin.InjectManifest) {
            plugin.config.maximumFileSizeToCacheInBytes = 50 * 1024 * 1024;
        }
    });

    if (config.output) {
        const version = new Date().getTime();
        config.output.filename = `static/js/[name].${version}.[contenthash:8].js`;
        config.output.chunkFilename = `static/js/[name].${version}.[contenthash:8].chunk.js`;
    }

    config.plugins = [
        ...config.plugins,
        new CompressionWebpackPlugin({
            algorithm: 'gzip',
            test: /\.(js|css)$/, // 压缩 JavaScript 和 CSS 文件
            threshold: 10240, // 仅压缩大于 10KB 的文件
            minRatio: 0.8 // 仅压缩压缩率大于 0.8 的文件
        }),
        new webpack.ProvidePlugin({
            process: 'process/browser.js',
            Buffer: ['buffer', 'Buffer']
        })
    ];

    return config;
};
