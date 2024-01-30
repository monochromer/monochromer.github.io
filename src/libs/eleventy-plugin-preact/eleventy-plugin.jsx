const path = require('node:path');
const fs = require('node:fs');
const { parseHTML } = require('linkedom');
const frontMatter = require('gray-matter');
const markdownIt = require('markdown-it');
const { renderPage } = require('./render.tsx');
const { EleventyContextProvider } = require('./context.tsx');
const { defaultComponents, FallbackComponent } = require('./makrdown-content.tsx');

function prepareEleventyContext(eleventyConfig, data) {
  const functions = {};
  for (const [funcName, func] of Object.entries(eleventyConfig.javascriptFunctions)) {
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

module.exports = function(eleventyConfig, pluginOptions = {}) {
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

  const userComponents = (() => {
    try {
      return require(pluginOptions?.componentsPath).default;
    } catch {
      return null;
    }
  })()

  function getComponent(key) {
    return userComponents?.[key] ?? defaultComponents?.[key] ?? FallbackComponent;
  }

  function createComponentFromNode(node) {
    const key = node.nodeName.toLowerCase();
    const Component = getComponent(key);
    const children = renderNodes(node.childNodes);
    return (props) => {
      return (
        <Component node={node} {...props}>
          {children}
        </Component>
      )
    }
  }

  function renderNodes(childNodes) {
    return [...childNodes].map((node) => {
      const Component = createComponentFromNode(node);
      return <Component />;
    })
  }

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
      const shiki = await import('shiki');
      const themeSchemeFilePath = path.join(__dirname, 'code-themes', 'gruvbox-light-soft.json');
      const themeScheme = JSON.parse(fs.readFileSync(themeSchemeFilePath, 'utf-8'));
      codeHightlighter = await shiki.getHighlighter({
        themes: [themeScheme],
        langs: Object.keys(shiki.bundledLanguages),
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

        const MarkdownContentComponent = () => {
          return (
            <EleventyContextProvider value={eleventyContext}>
              {data.children ? renderNodes(data.children) : null}
            </EleventyContextProvider>
          )
        }

        Object.assign(MarkdownContentComponent, {
          Title: data.titleElement ? createComponentFromNode(data.titleElement) : null,
          TitleContent: data.titleElement ? () => renderNodes(data.titleElement.childNodes) : null,
          Excerpt: data.excerptElements ? () => renderNodes(data.excerptElements) : null,
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
      const module = require(path.join(process.cwd(), inputPath));
      const data = module.frontmatter ?? module.data;
      const resultData = typeof data === 'function' ? await data() : data;
      return resultData;
    },

    async compile(inputContent, inputPath) {
      if (
        typeof pluginOptions.filter === 'function' &&
        !pluginOptions.filter(inputContent, inputPath)
      ) {
        return;
      }

      const { default: Component } = require(path.join(process.cwd(), inputPath));

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

  eleventyConfig.addTransform('eleventy-plugin-preact-transform', function(content) {
    if (!templateFormats.concat('md').includes(this.page.templateSyntax)) {
      return content;
    }

    const Component = content;
    const rawHtml = renderPage(<Component />);
    return rawHtml;
  });
}