/**
 * Created by huangxinghui on 2015/8/15.
 */

var gulp = require('gulp');

gulp.task('locale', function() {
  return gulp.src('./src/locales/*')
      .pipe(gulp.dest('./build/locales/'));
});