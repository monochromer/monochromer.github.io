module.exports = {
  taskName: 'views',
  description: 'Обработка html',
  isProduction: process.env.NODE_ENV === 'production',
  src: 'src/views/pages/*.*',
  watchFiles: 'src/views/**/*.*',
  dest: 'build/',
  engineOptions: {
    locals: {},
    pretty: '\t'
  }
}
