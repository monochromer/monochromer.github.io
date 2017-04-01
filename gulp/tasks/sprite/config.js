module.exports = {
  taskName: 'sprite:images',
  description: 'Создание растрового спрайта',
  isProduction: process.env.NODE_ENV === 'production',
  src: 'src/icons/*.*',
  watchFiles: 'src/icons/*.*',
  imgDest: 'build/assets/img',
  stylesDest: '',
  spriteOptions: {
    algorithm: 'binary-tree',
    padding: 0,
    algorithmOpts: {
      sort: false
    },
    imgName: 'icons.png',
    // imgPath: `${config.paths.build.img}icons.png`,
    // retinaSrcFilter: '*@2x.png',
    // retinaImgName: 'icons@2x.png',
    cssTemplate: 'sprite-template.stylus.hbs',
    // cssName: 'sprite.css',
    // cssFormat: 'css',
    cssName: 'sprite.styl',
    cssFormat: 'stylus',
  }
};
