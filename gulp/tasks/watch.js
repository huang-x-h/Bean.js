var gulp = require('gulp');
var livereload = require('gulp-livereload');
var server = require('../config').server;

gulp.task('watch', ['server'], function() {
  livereload.listen({basePath: server.basePath});

  gulp.watch('./scss/*.scss', ['sass']);
  gulp.watch('./src/**/*', ['browserify']);
});
