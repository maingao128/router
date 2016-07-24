// 拼接html
gulp.task('include-html', ['clean'], function (cb) {
    // console.log(1111);
    gulp.src(path.join(srcPath, 'page/**/*.html'), {
            base: path.resolve(srcPath, 'page')
        })
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(dest))
        .on('end', function () {
            cb();
        });
});
