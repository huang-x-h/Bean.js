var gulp = require('gulp');

gulp.task('watch', ['browserSync'], function () {
    gulp.watch('./scss/*.scss', ['sass']);
});
