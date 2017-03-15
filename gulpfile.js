'use strict';

global.$ = {
    package: require('./package.json'),
    config: require('./gulp/config'),
    path: {
        task: require('./gulp/paths/tasks.js'),
        jsFoundation: require('./gulp/paths/js.foundation.js'),
        cssFoundation: require('./gulp/paths/css.foundation.js'),
        app: require('./gulp/paths/app.js')
    },
    gulp: require('gulp'),
    del: require('del'),
    browserSync: require('browser-sync').create(),
    nodemon: require('nodemon'),
    spritesmith: require("gulp.spritesmith"),
    ftp: require('vinyl-ftp'),
    gp: require('gulp-load-plugins')(),
    fs: require('fs')
};

$.path.task.forEach(function (taskPath) {
    require(taskPath)();
});

$.gulp.task('default', $.gulp.series(
    $.gulp.parallel(
        'clean',
        'clean:sprites-scss'
    ),
    $.gulp.parallel( //Create .scss/css files also
        'sprite:svg',
        'sprite:png'
    ),
    $.gulp.parallel(
        'sass',
        'js:foundation',
        'js:process',
        'copy:image',
        'copy:font',
        'copy:google-map-verify',
        'css:foundation'
    ),
    $.gulp.parallel(
        'nodemon'
    ),
    $.gulp.parallel(
        'watch',
        'serve'
    )
));
