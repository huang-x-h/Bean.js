/**
 * Created by huangxinghui on 2015/5/25.
 */

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function () {
    return gulp.src('./scss/main.scss')
        .pipe(sass({errLogToConsole: true}))
        .pipe(autoprefixer('last 2 versions', {map: false}))
        .pipe(gulp.dest('./build'));
});