/**
 * SVG Sprite
 */
module.exports = (gulp, plugins, config) => (done) => {
  return plugins.combiner(
    gulp.src(config.src),
    plugins.svgSprite(config.svgSpriteConfig),
    gulp.dest(config.dest),
    plugins.if(!!plugins.browserSync.active, plugins.browserSync.stream(), plugins.util.noop())
  ).on('error', config.onError);
};
