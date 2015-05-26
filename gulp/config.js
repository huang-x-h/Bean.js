var dest = './build';
var src = './src';

module.exports = {
    browserSync: {
        server: {
            // Serve up our build folder
            baseDir: dest
        }
    },
    sass: {
        src: './scss/main.scss',
        dest: dest
    }
};
