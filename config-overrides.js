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

    // config.optimization = {
    //     splitChunks: {
    //         chunks: 'all', // 该配置表示将应用于所有类型的代码块，包括同步和异步
    //         minSize: 30000, // 模块的最小大小，大于此值的模块才会被拆分
    //         maxSize: 0, // 模块的最大大小，0表示没有限制
    //         minChunks: 1, // 模块的最小引用次数，超过此值的模块才会被拆分
    //         maxAsyncRequests: 5, // 异步加载时的最大并行请求数
    //         maxInitialRequests: 3, // 初始加载时的最大并行请求数
    //         automaticNameDelimiter: '~', // 自定义拆分块的名称分隔符
    //         name: 'mofa', // 使用默认的块命名
    //         cacheGroups: {
    //             // 缓存组配置
    //             vendors: {
    //                 test: /[\\/]node_modules[\\/]/, // 将node_modules中的模块拆分到vendors组
    //                 priority: -10 // 优先级，数值越大优先级越高
    //             },
    //             default: {
    //                 minChunks: 2, // 最小引用次数，至少在两个块中引用的模块才会被拆分到默认组
    //                 priority: -20, // 优先级
    //                 reuseExistingChunk: true // 允许复用已存在的块
    //             }
    //         }
    //     }
    // };

    return config;
};
