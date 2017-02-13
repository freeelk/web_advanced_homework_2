'use strict';

module.exports = function() {
    $.gulp.task('sprite:png', function() {
        var spriteData = $.gulp.src('./source/images/sprite/*.png').pipe($.spritesmith({
            imgName: '../img/sprite.png',
            cssName: 'sprite-png.css'
        }));

        spriteData.img.pipe($.gulp.dest($.config.root + '/assets/img'));
        spriteData.css.pipe($.gulp.dest($.config.root + '/../source/style/sprites_generated'));
        return spriteData;
    })
};
