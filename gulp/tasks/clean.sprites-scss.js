'use strict';

module.exports = function() {
  $.gulp.task('clean:sprites-scss', function(cb) {
    return $.del($.config.spritesScss, cb);
  });
};

