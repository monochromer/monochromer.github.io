module.exports = {
  pagination: {
    data: 'collections.articles',
    size: 1,
    alias: 'article'
  },

  layout: 'base.webc',

  eleventyComputed: {
    permalink: function(data) {
      const { article } = data
      const { fileSlug } = article
      return `/articles/${fileSlug}/`
    }
  }
}