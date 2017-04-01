/**
 * Запуск сервера Browsersync для разработки
 */
module.exports = (gulp, plugins, config) => () => {
  return plugins.browserSync
    .init(Object.assign(Object.create(null), config.bsConfig || {}));
};
