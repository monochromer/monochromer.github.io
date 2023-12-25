const ENVS = {
  PRODUCTION: 'production',
  DEVELOPMENT: 'development'
}

module.exports = Object.freeze({
  isProductionMode: process.env.NODE_ENV === ENVS.PRODUCTION,

  get isDevelopmentMode() {
    return !this.isProductionMode
  },

  folders: Object.freeze({
    src: 'src',
    dest: 'dist'
  }),
})