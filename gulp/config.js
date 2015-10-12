var dest = './build';
var src = './src';

module.exports = {
  server: {
    // Serve up our build folder
    basePath: dest
  },
  browserify: {
    debug: true,
    extensions: ['.hbs'],
    entries: src + '/bundle.js',
    dest: dest,
    outputName: 'bundle.js'
  },
  sass: {
    src: './scss/main.scss',
    dest: dest
  }
};
