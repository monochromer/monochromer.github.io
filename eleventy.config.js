const pluginWebc = require('@11ty/eleventy-plugin-webc')

const config = require('./config')
const { Collection } = require('./src/core/collection/collection')

module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(pluginWebc, {
    components: `${config.folders.src}/components/**/*.webc`,
    useTransform: false,
    transformData: {},
  })

  eleventyConfig.addPassthroughCopy(`${config.folders.src}/assets`)

  eleventyConfig.addCollection('articles', (collectionAPI) => {
    const articles = collectionAPI.getFilteredByGlob('src/data/articles/*/index.html')
    return new Collection(articles)
  })

  return {
    dir: {
      input: config.folders.src,
      output: config.folders.dest,
      data: 'global-data',
      layouts: 'layouts'
    },
    markdownTemplateEngine: false,
    htmlTemplateEngine: false,
    templateFormats: ['html', 'webc']
  }
}