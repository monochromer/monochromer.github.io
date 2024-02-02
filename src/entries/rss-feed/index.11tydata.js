function formatDate(date) {
  return date.toUTCString();
}

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
      return formatDate(lastArticle.data.publishedAt);
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
          publishedDate: formatDate(article.data.publishedAt),
          content: article.data.contentRawHtml
        }));
    },
  }
}