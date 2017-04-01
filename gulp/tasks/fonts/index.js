/**
 * Обработка шрифтов
 */
module.exports = (gulp, plugins, config) => () => {
  return plugins.combiner(
      gulp.src(config.src, {
        since: gulp.lastRun(config.taskName)
      }),
      plugins.newer(config.dest),
      gulp.dest(config.dest),
      plugins.if(!!plugins.browserSync.active, plugins.browserSync.stream(), plugins.util.noop())
    ).on('error', config.onError);
};
