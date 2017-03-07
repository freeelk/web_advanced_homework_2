'use strict';

module.exports = function() {
  $.gulp.task('copy:google-map-verify', function() {
    return $.gulp.src(['./source/google_map_verify/*.html'], { since: $.gulp.lastRun('copy:google-map-verify') })
      .pipe($.gulp.dest($.config.root + '/'));
  });
};
