module.exports = {
  permalink: '/rss-feed.xml',
  articlesToDisplay: 10,
  eleventyComputed: {
    sortedArticles(data) {
      const articlesCollection = data?.collections?.articles;
      if (!articlesCollection || !articlesCollection.length) {
        return null;
      }
    return articlesCollection.toSorted((a, b) => b.data.publishedAt - a.data.publishedAt);
    },

    lastBuildDate(data) {
      const { sortedArticles } = data;
      if (!sortedArticles || !sortedArticles.length) {
        return null;
      }
      return (new Date(sortedArticles[0].publishedAt)).toUTCString();
    },

    articles(data) {
      const { sortedArticles } = data;
      if (!sortedArticles || !sortedArticles.length) {
        return null;
      }
      return sortedArticles
        .slice(0, data.articlesToDisplay)
        .map((article) => ({
          title: article.data.title,
          link: data.meta.siteBaseLink + article.page.url,
          date: new Date(article.data.publishedAt).toUTCString(),
          content: article.data.contentRawHtml
        }));
    },
  }
}