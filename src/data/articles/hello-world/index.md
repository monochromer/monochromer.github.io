# Hello, world!

___
Создал блог. В первую очередь, для разных экспериментов с [Eleventy](http://11ty.dev) и около него. Далее очень кратко расскажу, что там внутри.
___

## Preact как шаблонизатор

Внедрил [Preact](https://preactjs.com/) как JSX-шаблонизатор с поддержкой цепочки layout'ов и передачи данных через контекст. Выглядит это примерно так:

```javascript
// файл `article.11ty.jsx`
// `data` может быть асинхронной функцией, возвращающей объект, в котором, в свою очередь, может быть `eleventyComputed`
export const data = {
  layout: 'base'
}

export default function ArticlePage() {
  // в `data` находится каскад данных
  const { data } = useEleventyContext();
  // `data.content` не строка, как в других Eleventy-шаблонизаторах, а компонент. Вернее, набор компонентов.
  const Content = data.content;

  return (
    <article>
      <header>
        <h1>
          <Content.TitleContent />
        </h1>
        <Content.Excerpt />
      </header>  
      <Content.Body />
    </article>
  )
}
```

```javascript
// файл `base.11ty.jsx`
export const BaseLayout = () => {
  // `functions` – фильтры и функции, которые можно определить в `eleventy.config.js`
  const { data, functions } = useEleventyContext();
  const Content = data.content;

  return (
    // `<!DOCTYPE html>` добавляется автоматически к результату рендеринга
    <html>
      <head>
        <meta charSet="utf-8"/>  
        <title>{data.title}</title>
        <script>{functions.getCriticalJSContent()}</script>
        <style>{functions.getCriticalCSSContent()}</style>
      </head>
      <body>
        <main>
          <Content />
        </main>  
      </body>
    </html>
  )
}
```

Для клиентских скриптов сам Preact пока не применяется.

### Esbuild

Для обработки клиентского JS и CSS используется [esbuild](https://esbuild.github.io/).

## Кастомная обработка markdown

В markdown-файлах отсутствует frontmatter-секция. Она заполняется во внешнем data-файле. Заголовок статьи пишется как `h1`, а выдержка (excerpt) располагается между двумя `<hr>`. Всё это нужно для более удобного чтения исходных файлов на внешних сервисах, например, на Github.

```markdown
# Заголовок статьи

___
Краткое описание или вводная часть
___

Основной контент
```

Контентные markdown-блоки можно проецировать на Preact-компоненты с возможностью получить доступ к оригинальному блоку c помощью DOM API и каскаду данных Eleventy:
```javascript
export default {
  'p': (props) => {
    const { data, functions } = useEleventyContext();
    const { node, children } = props;
    return (
      <p className={'paragraph' + ' ' + node.classList.toString()}>
        {props.children}
      </p> 
    )
  }
```

## Подсветка блоков кода

Для подсветки блоков кода используется [Shiki](https://github.com/shikijs/shiki). Подкупила возможность подключать в нём любые определения тем в формате редактора TextMate, которые также поддерживаются в Sublime Text и VS Code. Выбрал [тему Gruvbox](https://marketplace.visualstudio.com/items?itemName=jdinhlife.gruvbox).

## Дизайн

Сайт не использует светлых (выжигающих) и тёмных (нечитабельных) тем оформления. Вместо этого дизайн выполнен в жёлто-коричневых оттенках, что, по моему сугубо личному мнению, приятнее для чтения. Размер шрифта текстовых блоков меняется плавно в зависимости от размера экрана без использования `@media`.

## RSS

За новыми статьями в блоге можно следить с помощью [RSS-ленты](/rss-feed.xml).

___

Все баги и предложения можно нести в [репозиторий на Github](https://github.com/monochromer/monochromer.github.io). Также связаться со мной можно по [этим контактам](/about/).