const { TIMESTAMPS, computeDate, getContentFolderPath } = require('@web-alchemy/eleventy-plugin-content-dates');

module.exports = {
  layout: 'article',

  eleventyComputed: {
    permalink(data) {
      return `/articles/${data.page.fileSlug}/`
    },

    description(data) {
      const { excerptElements } = data;

      if (!excerptElements || !excerptElements.length) {
        return null;
      }

      return excerptElements
        .map((element) => element.textContent.trim())
        .filter(Boolean)
        .join('. ');
    },

    updatedAt(data) {
      return computeDate({
        strategy: data.env.isDevelopmentMode ? TIMESTAMPS.FS_LAST_MODIFIED : TIMESTAMPS.GIT_LAST_MODIFIED,
        contentPath: getContentFolderPath(data)
      })
    }
  }
}