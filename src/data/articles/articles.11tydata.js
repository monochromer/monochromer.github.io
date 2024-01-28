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
      const strategy = data.env.isDevelopmentMode ? TIMESTAMPS.FS_LAST_MODIFIED : TIMESTAMPS.GIT_LAST_MODIFIED;
      const contentPath = getContentFolderPath(data);

      console.log('debug: ', strategy, ', ', contentPath);
      return computeDate({
        strategy,
        contentPath
      })
    }
  }
}