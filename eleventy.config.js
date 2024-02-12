import fs from 'node:fs';
import path from 'node:path';
import esbuild from 'esbuild';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import eleventyPluginBundle from '@11ty/eleventy-plugin-bundle';
import eleventyPluginPreact from './src/libs/eleventy-plugin-preact/.eleventy.js';
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
    componentsPath: path.join(process.cwd(), './src/markdown-components-map.tsx')
  });

  /* add bundle after our plugin for correct html transform */
  eleventyConfig.addPlugin(eleventyPluginBundle, {
    toFileDirectory: 'bundle',
    bundles: [],
    transforms: [
      async function(content) {
        switch (this.type) {
          case 'css': {
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
            })
            return result.outputFiles[0].text;
          }
          case 'js': {
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
            })
            return result.outputFiles[0].text;
          }
          default: return content;
        }
      }
    ],
    hoistDuplicateBundlesFor: []
  });

  eleventyConfig.addJavaScriptFunction('getFileContent', function(filePath) {
    const fileContent = fs.readFileSync(filePath, {
      encoding: 'utf-8'
    });
    return fileContent;
  });

  eleventyConfig.addJavaScriptFunction('getMainStylesContent', function() {
    const fileContent = this.getFileContent('src/entries/main.css');
    this.css(fileContent);
    return this.getBundle('css');
  });

  eleventyConfig.addJavaScriptFunction('getCriticalJSContent', function() {
    const fileContent = this.getFileContent('src/components/page/page.client.js');
    this.js(fileContent, 'critical-js');
    return this.getBundle('js', 'critical-js');
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