module.exports = {
  taskName: 'server',
  description: 'Запуск сервера Browsersync для разработки',
  bsConfig: {
    server: {
      baseDir: 'build',
      directory: true
    },
    files: 'build/**/*.*',
    host: 'localhost',
    port: 3000,
    notify: true,
    injectChanges: true,
    open: true,
    tunnel: false
  }
}
