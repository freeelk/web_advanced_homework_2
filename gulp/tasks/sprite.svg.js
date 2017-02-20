'use strict';

let svgSpriteConfig = {
  mode: {
    symbol: {
      sprite: "../sprite.svg",
      render: {
        scss: {
          dest:'../../../../../source/style/sprites_generated/sprite-svg.scss',
        },
      },
    },
  }
};

module.exports = function() {
  $.gulp.task('sprite:svg', function() {
    return $.gulp.src('./source/images/sprite/*.svg')
      .pipe($.gp.svgmin({
        js2svg: {
          pretty: true
        }
      }))
      .pipe($.gp.cheerio({
        run: function ($) {
          $('[fill]').removeAttr('fill');
          $('[stroke]').removeAttr('stroke');
          $('[style]').removeAttr('style');
        },
        parserOptions: { xmlMode: true }
      }))
      .pipe($.gp.replace('&gt;', '>'))
      .pipe($.gp.svgSprite(svgSpriteConfig))
      .pipe($.gulp.dest($.config.root + '/assets/img/sprite'))
  })
};
