const { TIMESTAMPS, computeDate, getContentFolderPath } = require('@web-alchemy/eleventy-plugin-content-dates');

module.exports = {
  layout: 'article',

  eleventyComputed: {
    permalink(data) {
      return `/articles/${data.page.fileSlug}/`
    },

    description(data) {
      if (data.description) {
        return data.description;
      }

      const { excerptElements } = data;

      if (!excerptElements || !excerptElements.length) {
        return null;
      }

      return excerptElements
        .map((element) => element.textContent.trim())
        .filter(Boolean)
        .join('. ');
    },

    publishedAt(data) {
      if (!data.publishedAt) {
        return;
      }

      return new Date(data.publishedAt);
    },

    updatedAt(data) {
      return computeDate({
        strategy: data.env.isDevelopmentMode ? TIMESTAMPS.FS_LAST_MODIFIED : TIMESTAMPS.GIT_LAST_MODIFIED,
        contentPath: getContentFolderPath(data)
      })
    }
  }
}