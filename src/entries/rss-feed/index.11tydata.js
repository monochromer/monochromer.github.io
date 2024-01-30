module.exports = {
  permalink: '/rss-feed.xml',
  articlesToDisplay: 10,
  eleventyComputed: {
    lastBuildDate(data) {
      const articles = data?.collections?.articles;
      if (!articles || !articles.length) {
        return null;
      }
      const lastArticle = articles[0];
      return lastArticle.data.publishedAt.toUTCString();
    },

    articles(data) {
      const articles = data?.collections?.articles;
      if (!articles || !articles.length) {
        return null;
      }
      return articles
        .slice(0, data.articlesToDisplay)
        .map((article) => ({
          title: article.data.title,
          link: data.meta.siteBaseLink + article.page.url,
          date: article.data.publishedAt.toUTCString(),
          content: article.data.contentRawHtml
        }));
    },
  }
}