module.exports = {
  taskName: 'sprite:svg',
  description: 'Сборка svg-спрайта',
  src: 'src/svg-sprite/**/*.svg',
  watchFiles: 'src/svg-sprite/**/*.*',
  dest: 'build/assets/img',
  svgSpriteConfig: {
    "mode": {
      "symbol": {
        dest: '',
        sprite: 'icons.svg',
        bust: false
      }
    },
    "transform": [{
      "svgo": {
        "plugins": [
          {
            "cleanupAttrs": false
          },
          {
            "removeTitle": false
          },
          {
            "cleanupIDs": false
          },
          {
            "mergePaths": false
          }
        ]
      }
    }],
    "svg": {
      "xmlDeclaration": false,
      "doctypeDeclaration": false
    }
  }
};
