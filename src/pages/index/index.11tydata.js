module.exports = {
  permalink: '/',

  layout: 'base.webc',

  title: 'First Article Title',

  description: 'First Article description',

  eleventyComputed: {
    articles: (data) => {
      const articlesCollection = data?.collections?.articles;
      const [article] = articlesCollection;
      return []
    }
  }
}