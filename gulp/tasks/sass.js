/**
 * Created by huangxinghui on 2015/5/25.
 */

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var config = require('../config').sass;

gulp.task('sass', function () {
    return gulp.src(config.src)
        .pipe(sass({errLogToConsole: true}))
        .pipe(autoprefixer('last 2 versions', {map: false}))
        .pipe(gulp.dest(config.dest));
});