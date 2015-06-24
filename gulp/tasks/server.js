/**
 * Created by huangxinghui on 2015/6/24.
 */

var gulp = require('gulp'),
    http = require('http'),
    st = require('st'),
    server = require('../config').server;

gulp.task('server', function(done) {
    http.createServer(
        st({ path: server.basePath, index: 'index.html', cache: false })
    ).listen(8080, done);
});