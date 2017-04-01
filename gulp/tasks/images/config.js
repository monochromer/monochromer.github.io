module.exports = {
  taskName: 'images',
  description: 'Обработка изображений',
  isProduction: process.env.NODE_ENV === 'production',
  src: 'src/images/**/*.*',
  watchFiles: 'src/images/**/*.*',
  dest: 'build/assets/img',
  imageminOptions: {}
}
