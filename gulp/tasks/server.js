/**
 * Created by huangxinghui on 2015/6/24.
 */

var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    server = require('../config').server;

gulp.task('server', function(done) {
  browserSync({
    notify: false,
    logPrefix: 'Bean',
    server: [server.basePath],
    port: 3000
  });

  gulp.watch(['./scss/*.scss'], ['sass', reload]);
  gulp.watch(['./src/**/*.js'], ['lint', 'browserify', reload]);
});