/**
 * Created by huangxinghui on 2015/8/15.
 */

var gulp = require('gulp');

gulp.task('i18n', function() {
  return gulp.src('./src/locales/*')
      .pipe(gulp.dest('./build/i18n/'));
});