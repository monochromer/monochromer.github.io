module.exports = (gulp, plugins, config) => {
  const webpackStream = require('webpack-stream');

  return (done) => {
    return plugins.combiner(
      gulp.src(config.src),
      webpackStream(config.webpack),
      gulp.dest(config.dest)
    ).on('error', config.onError);
  };
};
