var fs = require('fs')
var path = require('path')
var config = require('../config')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var pkg = require(path.resolve(__dirname, '../package.json'));

exports.assetsPath = function (_path) {
    return path.posix.join(config.build.assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
    options = options || {}
        // generate loader string to be used with extract text plugin
    function generateLoaders(loaders) {
        var sourceLoader = loaders.map(function (loader) {
            var extraParamChar
            if (/\?/.test(loader)) {
                loader = loader.replace(/\?/, '-loader?')
                extraParamChar = '&'
            } else {
                loader = loader + '-loader'
                extraParamChar = '?'
            }
            return loader + (options.sourceMap ? extraParamChar + 'sourceMap' : '')
        }).join('!')

        if (options.extract) {
            return ExtractTextPlugin.extract('vue-style-loader', sourceLoader)
        } else {
            return ['vue-style-loader', sourceLoader].join('!')
        }
    }

    // http://vuejs.github.io/vue-loader/configurations/extract-css.html
    return {
        css: generateLoaders(['css']),
        postcss: generateLoaders(['css']),
        less: generateLoaders(['css', 'less']),
        sass: generateLoaders(['css', 'sass?indentedSyntax']),
        scss: generateLoaders(['css', 'sass']),
        stylus: generateLoaders(['css', 'stylus']),
        styl: generateLoaders(['css', 'stylus'])
    }
}

/**
 * 自动生成html
 * @param  {Object} options
 * @return {Array}
 */
exports.generatHtml = function (options) {
    var baseWebpackConfig = options.baseWebpackConfig;
    var entries = baseWebpackConfig.entry;
    var ret = [];

    for (var entry in entries) {

        var entryValue = entries[entry];
        if (Array.isArray(entryValue)) {
            entryValue = entryValue.filter(function (v) {
                return v.indexOf('/src/page/') > -1;
            })[0];
        }

        // common不生成对应的html，找到src/page的html插入common chunks
        if (entryValue.indexOf('/common/common') === -1) {
            ret.push(new HtmlWebpackPlugin({
                filename: path.resolve(__dirname, '..', 'output', entry + '/' + entry + '.html'),
                template: path.resolve(__dirname, '..', entryValue + '.html'),
                chunks: [entry, 'common']
            }));
        }
    }

    return ret;
};

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
    var output = []
    var loaders = exports.cssLoaders(options)
    for (var extension in loaders) {
        var loader = loaders[extension]
        output.push({
            test: new RegExp('\\.' + extension + '$'),
            loader: loader
        })
    }
    return output
}

exports.generatConfig = function () {
    var needLogin = config.needLogin;
    // pages
    var pages = fs.readdirSync(path.resolve(__dirname, '..', 'src', 'page'))
        .filter(function (page) {
            // get rid of common, .svn or some .*
            return page !== 'common' && page.indexOf('.') !== 0;
        })
        .map(function (page) {
            return {
                name: page,
                file: ['/', '/', '.html'].join(page),
                login: needLogin.indexOf(page) >= 0
            };
        });

    return {
        id: pkg.name,
        pages: pages
    };
};
