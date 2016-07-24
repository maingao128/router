var fs = require('fs')
var path = require('path')
var config = require('../config')
var utils = require('./utils')
var projectRoot = path.resolve(__dirname, '../')
var srcRoot = path.resolve(projectRoot, 'src');
var pagePath = path.resolve(srcRoot, 'page');
var commonPath = path.resolve(projectRoot, '../components-common/');

var pages = fs.readdirSync(pagePath).filter(function (page) {
    return page.indexOf('.') !== 0;
});

var entry = {};
pages.forEach(function (page) {
    entry[page] = ['.', 'src/page', page, page].join('/');
});

console.log('入口文件列表：\n', entry);

module.exports = {

    entry: entry,
    output: {
        path: config.build.assetsRoot,
        publicPath: config.build.assetsPublicPath,
        filename: '[name]/[name].js'
    },
    resolve: {
        extensions: ['', '.js', '.vue'],
        fallback: [path.join(__dirname, '../node_modules')],
        alias: {
            'widget': path.resolve(srcRoot, 'widget'),
            'dep': path.resolve(commonPath, 'dep'),
            'dev': path.resolve(commonPath, 'dev'),
            'pkg': path.resolve(projectRoot, 'package.json'),
            'component': path.resolve(srcRoot, 'component'),
            'common': path.resolve(commonPath, 'widget')
        }
    },
    resolveLoader: {
        fallback: [path.join(__dirname, '../node_modules')]
    },
    module: {
        // preLoaders: [{
        //     test: /\.vue$/,
        //     loader: 'eslint',
        //     include: projectRoot,
        //     exclude: /node_modules/
        // }, {
        //     test: /\.js$/,
        //     loader: 'eslint',
        //     include: projectRoot,
        //     exclude: /node_modules/
        // }],
        loaders: [{
            test: /\.vue$/,
            loader: 'vue'
        }, {
            test: /\.js$/,
            loader: 'babel',
            include: projectRoot,
            exclude: /node_modules/
        }, {
            test: /\.json$/,
            loader: 'json'
        }, {
            test: /\.tpl$/,
            loader: 'crox'
        }, {
            test: /\.html$/,
            loader: 'vue-html'
        }, {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: 'url',
            query: {
                limit: 10000,
                name: utils.assetsPath('img/[name].[hash:7].[ext]')
            }
        }, {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url',
            query: {
                limit: 10000,
                name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
            }
        }]
    },
    eslint: {
        formatter: require('eslint-friendly-formatter')
    },
    vue: {
        loaders: utils.cssLoaders()
    }
}
