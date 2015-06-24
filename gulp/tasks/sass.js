/**
 * Created by huangxinghui on 2015/5/25.
 */

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var livereload = require('gulp-livereload');
var config = require('../config').sass;
var options = {
    sass:  {
        errLogToConsole: true,
        precision: 8
    }
};

gulp.task('sass', function () {
    return gulp.src(config.src)
        .pipe(sass(options.sass))
        .pipe(autoprefixer('last 2 versions', {map: false}))
        .pipe(gulp.dest(config.dest))
        .pipe(livereload());
});