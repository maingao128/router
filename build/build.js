// https://github.com/shelljs/shelljs
require('shelljs/global');
var fs = require('fs');
var path = require('path');

var pkg = require(path.resolve(__dirname, '../package.json'));
var utils = require('./utils');
var NODE_ENV = env.NODE_ENV;
var zipFolder = require('zip-folder');
var path = require('path');
var config = require('../config');
var ora = require('ora');
var webpack = require('webpack');
var webpackConfig;
var zipFile;
if (NODE_ENV === 'qa') {
    webpackConfig = require('./webpack.qa.conf');
    zipFile = pkg.name + '_qa.zip';
} else {
    webpackConfig = require('./webpack.prod.conf');
    zipFile = pkg.name + '_pro.zip';
}

console.log('正在打包... \n打包环境:' + NODE_ENV);

// https://github.com/sindresorhus/ora
var spinner = ora('building for ' + NODE_ENV + '...');
spinner.start();

var assetsPath = path.join(config.build.assetsRoot);
var configPath = path.resolve(assetsPath, 'config.json');
var releasePath = config.build.releasePath;
rm('-rf', assetsPath);
mkdir('-p', assetsPath);
mkdir('-p', releasePath);
cp('-R', 'static/', assetsPath);
// 生成config.json文件
touch(configPath);
fs.writeFileSync(configPath, JSON.stringify(utils.generatConfig(), null, 4));

webpack(webpackConfig, function (err, stats) {
    spinner.stop();
    if (err) throw err

    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }) + '\n');

    var zipFilePath = path.resolve(releasePath, zipFile);
    zipFolder(assetsPath, zipFilePath, function (err) {
        if (err) {
            console.log('oh no!', err);
        } else {
            console.log('打包产出文件存放路径：', zipFilePath);
        }
    });
});
