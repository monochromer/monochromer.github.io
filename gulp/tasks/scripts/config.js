module.exports = {
  taskName: 'scripts',
  description: 'Сборка скриптов',
  isProduction: process.env.NODE_ENV === 'production',
  src: 'src/scripts/*.*',
  dest: 'build/assets/js/',
  watchFiles: 'src/scripts/**/*.*',
  webpack: require('./webpack.config')
};
