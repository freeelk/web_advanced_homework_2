'use strict';

module.exports = function() {
  $.gulp.task('serve', function() {
    $.browserSync.init({
      open: false,
      proxy: 'http://localhost:3000',
      port: 4000
    });
  });
};
