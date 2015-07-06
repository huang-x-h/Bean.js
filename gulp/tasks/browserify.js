/**
 * Created by huangxinghui on 2015/6/24.
 */

var browserify = require('browserify');
var gulp = require('gulp');
var livereload = require('gulp-livereload');
var source = require('vinyl-source-stream');
var config = require('../config').browserify;

function handleErrors(e) {
    console.log(e.message);
}

gulp.task('browserify', function () {
    var bundler = browserify({
        // Required watchify args
        cache: {}, packageCache: {}, fullPaths: true,
        // Specify the entry point of your app
        entries: config.entries,
        // Add file extentions to make optional in your requires
        extensions: config.extensions,
        // Enable source maps!
        debug: config.debug
    });

    return bundler
        .bundle()
        .on('error', handleErrors)
        .pipe(source(config.outputName))
        .pipe(gulp.dest(config.dest))
        .pipe(livereload());
});