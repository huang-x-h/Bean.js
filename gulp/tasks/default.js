/**
 * Created by huangxinghui on 2015/10/26.
 */

var gulp = require('gulp');

gulp.task('default', ['lint', 'browserify', 'sass', 'locale', 'image']);