import fs from 'node:fs';
import esbuild from 'esbuild';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import eleventyPluginPreact from '#root/libs/eleventy-plugin-preact/.eleventy.js';
import config from './config.js';

export default async function(eleventyConfig) {
  eleventyConfig.addWatchTarget('./src/**/*.css');
  eleventyConfig.addWatchTarget('./src/**/*.client.js');
  eleventyConfig.addWatchTarget('./src/components/*.tsx');
  eleventyConfig.setServerOptions({
    domDiff: false
  });

  eleventyConfig.addPlugin(eleventyPluginPreact, {
    templateFormats: ['11ty.jsx', '11ty.tsx'],
  });

  eleventyConfig.addBundle('css', {
    transforms: [
      async function(content) {
        const result = await esbuild.build({
          stdin: {
            contents: content,
            resolveDir: eleventyConfig.dir.input,
            sourcefile: this.page.inputPath,
            loader: 'css',
          },
          external: ['*.png', '*.jpg', '*.jpeg', '*.svg', '*.webp', '*.woff2'],
          outdir: eleventyConfig.dir.output + '/assets',
          bundle: true,
          minify: config.isProductionMode,
          write: false,
          target: browserslistToEsbuild()
        });
        return result.outputFiles[0].text;
      }
    ]
  });

  eleventyConfig.addBundle('js', {
    transforms: [
      async function(content) {
        const result = await esbuild.build({
          stdin: {
            contents: content,
            resolveDir: eleventyConfig.dir.input,
            sourcefile: this.page.inputPath,
            loader: 'js',
          },
          bundle: true,
          minify: config.isProductionMode,
          write: false,
          target: browserslistToEsbuild()
        });
        return result.outputFiles[0].text;
      }
    ]
  });

  eleventyConfig.addFilter('include', (filePath) => {
    return fs.readFileSync(filePath, 'utf-8');
  });

  eleventyConfig.addPassthroughCopy({ [`${config.folders.src}/assets/icons/`]: '/' });
  eleventyConfig.addPassthroughCopy({ [`${config.folders.src}/assets/*.*`]: '/assets/' });
  // !WARNING: buggy in incremental mode
  eleventyConfig.addPassthroughCopy({ [`${config.folders.src}/data/articles/`]: '/articles/' }, {
    filter: [
      '**/*.{png,jpg,jpeg,webp,avif,svg}'
    ]
  });

  eleventyConfig.addCollection('articles', (collectionAPI) => {
    return collectionAPI
      .getFilteredByGlob('src/data/articles/*/index.md')
      .toSorted((a, b) => b.data.publishedAt - a.data.publishedAt);
  });

  return {
    dir: {
      input: config.folders.src,
      output: config.folders.dest,
      data: 'global-data',
      layouts: 'layouts'
    },
    markdownTemplateEngine: false,
  }
}