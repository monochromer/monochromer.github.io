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
    }
  }
}