const { register } = require('esbuild-register/dist/node');

const esbuildRegister = () => {
  return register({
    jsx: 'automatic',
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    jsxImportSource: 'preact',
  })
}

module.exports = {
  esbuildRegister
}