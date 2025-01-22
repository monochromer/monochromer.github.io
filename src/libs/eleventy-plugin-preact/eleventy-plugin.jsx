import path from 'node:path';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import { parseHTML } from 'linkedom';
import frontMatter from 'gray-matter';
import markdownIt from 'markdown-it';
import { createHighlighter, bundledLanguages } from 'shiki';
import { renderToString, wrapComponentIntoContext } from './render.tsx';
import { EleventyContextProvider } from './context.tsx';
import { MarkdownContent } from './makrdown-content.tsx';

const ROOT_LAYOUT = '__root-jsx-layout__.11ty.js';

function prepareEleventyContext(eleventyConfig, data) {
  const functions = {};
  const eleventyFunctions = {
    ...eleventyConfig.universal.filters,
    ...eleventyConfig.universal.shortcodes,
    ...eleventyConfig.universal.pairedShortcodes,
    ...eleventyConfig.javascript.filters,
    ...eleventyConfig.javascript.shortcodes,
    ...eleventyConfig.javascript.pairedShortcodes,
    ...eleventyConfig.javascript.functions,
  }
  for (const [funcName, func] of Object.entries(eleventyFunctions)) {
    functions[funcName] = func.bind(functions);
  };
  for (const key of ['page', 'eleventy']) {
    if ((key in functions) || !data[key]) {
      continue;
    }
    functions[key] = data[key];
  }

  const eleventyContext = {
    // shallow copy for correct context values
    data: {...data },
    functions
  };

  return eleventyContext;
}

export default async function(eleventyConfig, pluginOptions = {}) {
  /** @type {import('shiki').Highlighter} */
  let codeHightlighter;

  const dataParsers = [
    function parseDataFromMakdown(DOM) {
      const title = DOM.document.firstElementChild;
      const excerptElements = [];

      const hasTitle = title?.tagName === 'H1';
      const hasExcerpt = title?.nextElementSibling?.tagName === 'HR' || title?.tagName === 'HR';
      const startExcerpt = hasTitle ? title.nextElementSibling : title;
      let excerptElement = startExcerpt;

      if (hasExcerpt) {
        while (excerptElement) {
          excerptElement = excerptElement.nextSibling;

          if (excerptElement?.tagName === 'HR') {
            excerptElement.remove();
            break;
          }
          excerptElements.push(excerptElement);
        }

        startExcerpt.remove();
        for (const element of excerptElements) {
          element?.remove();
        }
      }

      if (hasTitle) {
        title.remove();
      }

      const contentRawHtml = [...excerptElements, ...DOM.document.childNodes]
        .map((element) => element.outerHTML || element.textContent)
        .join('');

      return {
        title: hasTitle ? title.textContent : null,
        titleElement: hasTitle && title,
        excerptElements: excerptElements.length > 0 && excerptElements,
        children: DOM.document.childNodes,
        contentRawHtml
      }
    }
  ]

  eleventyConfig.addExtension('md', {
    read: true,

    encoding: 'utf-8',

    compileOptions: {
      cache: process.env.NODE_ENV !== 'development',
      permalink(contents, inputPath) {
        return (data) => data.permalink
      }
    },

    async init() {
      const themeSchemeFilePath = new URL('./code-themes/gruvbox-light-soft.json', import.meta.url);
      const themeScheme = JSON.parse(fs.readFileSync(themeSchemeFilePath, 'utf-8'));
      codeHightlighter = await createHighlighter({
        themes: [themeScheme],
        langs: Object.keys(bundledLanguages),
        langAlias: {
          'njk': 'liquid',
          'nunjucks': 'liquid',
        },
      });
    },

    async getData(inputPath) {
      const { content: markdownSource } = frontMatter(await fs.promises.readFile(inputPath, 'utf-8'));
      const markdownLib = markdownIt({
        html: true,
        linkify: false,
        typographer: false,
        xhtmlOut: false,
        breaks: false,
        highlight(content, lang) {
          const escapedHtml = markdownLib.utils.escapeHtml(content);
          if (lang) {
            return `<pre data-lang=${lang}><code>${escapedHtml}</code></pre>`;
          }
          return `<pre><code>${escapedHtml}</code></pre>`;
        }
      });
      const html = markdownLib.render(markdownSource);
      const DOM = parseHTML(html);
      const data = {};
      for (const parser of dataParsers) {
        Object.assign(data, parser(DOM));
      }
      return data;
    },

    async compile(inputContent, inputPath) {
      return async function(data) {
        const eleventyContext = prepareEleventyContext(eleventyConfig, data);

        const createMarkdownComponent = (nodes) => {
          return (props) => {
            return (
              <EleventyContextProvider value={eleventyContext}>
                <MarkdownContent nodes={nodes} components={props.components} />
              </EleventyContextProvider>
            )
          }
        }

        const MarkdownContentComponent = createMarkdownComponent(data.children);

        Object.assign(MarkdownContentComponent, {
          Title: data.titleElement ? createMarkdownComponent(data.titleElement) : null,
          TitleContent: data.titleElement ? createMarkdownComponent(data.titleElement.childNodes) : null,
          Excerpt: data.excerptElements ? createMarkdownComponent(data.excerptElements) : null,
          Body: MarkdownContentComponent
        });

        return MarkdownContentComponent;
      }
    }
  })

  eleventyConfig.addJavaScriptFunction('codeHighlight', (content, lang, options) => {
    if (!lang) {
      return content;
    }
    return codeHightlighter.codeToHtml(content, {
      lang,
      theme: 'Gruvbox Light Soft',
      ...options,
    });
  });

  const templateFormats = pluginOptions.templateFormats ?? ['jsx', 'tsx'];

  eleventyConfig.addTemplateFormats(templateFormats);

  eleventyConfig.addExtension(templateFormats, {
    read: false,

    outputFileExtension: 'html',

    compileOptions: {
      cache: process.env.NODE_ENV !== 'development',
      permalink(contents, inputPath) {
        return (data) => data.permalink;
      }
    },

    async getData(inputPath) {
      const moduleUrl = pathToFileURL(path.join(process.cwd(), inputPath))
      const module = await import(moduleUrl);
      const data = module.frontmatter ?? module.data;
      const resultData = typeof data === 'function' ? await data() : data;
      return Object.assign({ layout: ROOT_LAYOUT }, resultData);
    },

    async compile(inputContent, inputPath) {
      if (
        typeof pluginOptions.filter === 'function' &&
        !pluginOptions.filter(inputContent, inputPath)
      ) {
        return;
      }

      const moduleUrl = pathToFileURL(path.join(process.cwd(), inputPath));
      const { default: Component } = await import(moduleUrl);

      return async function renderTemplate(data) {
        const ChildComponent = data.layoutContent;
        const eleventyContext = prepareEleventyContext(eleventyConfig, data);

        function WrappedComponent(props) {
          return (
            <EleventyContextProvider value={eleventyContext}>
              <Component data={eleventyContext.data} childrenSlot={ChildComponent} {...props} />
            </EleventyContextProvider>
          )
        }

        return WrappedComponent;
      }
    }
  });

  eleventyConfig.addTemplate(path.join(eleventyConfig.dir.layouts ?? eleventyConfig.dir.includes, ROOT_LAYOUT), {
    async render(data) {
      const eleventyContext = prepareEleventyContext(eleventyConfig, data);
      const element = wrapComponentIntoContext(data.content, eleventyContext);
      const content = await renderToString(element);
      return '<!DOCTYPE html>' + content;
    }
  });
}