/**
 * Обработка представлений
 */
module.exports = (gulp, plugins, config) => () => {
  return plugins.combiner(
    gulp.src(config.src),
    plugins.pug(config.engineOptions),
    gulp.dest(config.dest),
    plugins.if(!!plugins.browserSync.active, plugins.browserSync.stream(), plugins.util.noop())
  ).on('error', config.onError);
}
