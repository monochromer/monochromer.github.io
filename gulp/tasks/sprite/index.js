
module.exports = (gulp, plugins, config) => () => {
  var buffer = require('vinyl-buffer');

  var spriteData = gulp.src(config.src)
    .pipe(plugins.spritesmith(config.spriteOptions));

  var imgStream = spriteData.img
    // We must buffer our stream into a Buffer for imagemin
    .pipe(buffer())
    .pipe(plugins.if(config.isProduction, plugins.imagemin(), plugins.util.noop()))
    .pipe(gulp.dest(config.imgDest));

  var styleStream = spriteData.css
    .pipe(gulp.dest(config.stylesDest));

  return plugins.combiner(
    imgStream,
    styleStream,
    plugins.if(!!plugins.browserSync.active, plugins.browserSync.stream(), plugins.util.noop())
  )
  .on('error', config.onError);
};
