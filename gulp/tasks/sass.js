/**
 * Created by huangxinghui on 2015/5/25.
 */

var gulp = require('gulp');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var config = require('../config').sass;
var options = {
  sass: {
    errLogToConsole: true,
    precision: 8
  }
};

gulp.task('sass', function() {
  return gulp.src(config.src)
      .pipe(sass(options.sass))
      .pipe(postcss([autoprefixer({browsers: ['last 2 versions']}), cssnano({zindex: false})]))
      .pipe(gulp.dest(config.dest));
});
