var config = require('../config');
var webpack = require('webpack');
var merge = require('webpack-merge');
var utils = require('./utils');
var baseWebpackConfig = require('./webpack.base.conf');
var HtmlWebpackPlugin = require('html-webpack-plugin');

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
    baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
});

var webpackConfig = merge(baseWebpackConfig, {
    module: {
        loaders: utils.styleLoaders()
    },
    // will be merged into base output
    output: {
        publicPath: config.build.assetsPublicPathDev
    },
    // eval-source-map is faster for development
    devtool: '#eval-source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': config.dev.env,
            '__DEV__': true,
            '__QA__': false,
            '__PRO__': false,
            '__PRE__': false
        }),
        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ]
});

// 生成自动html
utils.generatHtml({
    baseWebpackConfig: baseWebpackConfig
}).forEach(function (htmlWebpackPluginInstance) {
    webpackConfig.plugins.push(htmlWebpackPluginInstance);
});

module.exports = webpackConfig;
