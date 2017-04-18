/**
 * Очистка директории
 */
module.exports = (gulp, plugins, config) => (done) => {
  const del = require('del');
  return del([config.src])
    .then(function(paths) {
      plugins.util.log('Deleted:', plugins.util.colors.magenta(paths.join('\n')));
      done();
    });
};
