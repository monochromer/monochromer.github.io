# Работа с датами создания и обновления контента в Eleventy

При создании сайтов частой задачей является упорядочивание контента, например, статей в блоге. Генератор статических сайтов [Eleventy](https://www.11ty.dev) для каждой страницы предоставляет [полезный набор данных](https://www.11ty.dev/docs/data-eleventy-supplied/) `page`, в котором хранится url страницы, путь до файла-исходника и некоторые другие поля. Среди них важным является `page.date`. На его основе Eleventy сортирует коллекции страниц, только если мы сами не задали свои правила сортировки.

## Поле `date`

По умолчанию в `page.date` помещается дата создания файла. Но это значение можно настроить. Для этого есть [специальное поле `date`](https://www.11ty.dev/docs/dates/).

Туда можно записать любое стандартное (ISO 8601) значение даты.

```markdown
---
date: 2016-01-01
---
```

Но поле `date` может принимать особые значения-константы:

- `Last Modified` - дата последнего изменения файла.
- `Created` - дата создания файла.
- `git Last Modified` - дата последнего изменения файла, которая вычисляется с помощью системы контроля версий Git.
- `git Created` - дата создания файла, которая вычисляется с помощью системы контроля версий Git.

Пример даты на основе Git:

```markdown
---
date: git Created
---
```

Как видите, довольно удобно - даты можно брать из файловой системы, из Git или задавать вручную.

## Git-даты и сервисы CI/CD

Преимущество Git-способа является в том, что процесс установки дат автоматизируется. Но есть и минусы – такие вычисления требуют довольно много ресурсов, особенно для даты создания, так как нужно "отмотать" всю историю изменений до самого начала. Также сложности могут возникнуть при использовании различных CI/CD-инструментов, таких как Github Actions. Например, [Checkout](https://github.com/actions/checkout) делает по умолчанию поверхностное (shallow) клонирование репозитория. В этом случае даты могут вычисляться некорректно.

Одним из способов решения может быть указание в настройках Checkout параметра `fetch-depth: '0'`. Тогда даты будут верными, но будет выкачиваться вся история, все ветки и все теги.

```yaml
- name: Checkout
  uses: actions/checkout
  with:
    fetch-depth: '0'
```

Такие настройки необходимы для получения даты создания, но если нужна только дата последнего изменения, то есть другой способ - вручную склонировать репозиторий c последним коммитом, а вспомогательную информацию забрать с помощью `git fetch`:

```yaml
- name: Checkout
  run: |
    git clone --depth 1 <YOUR_REPO> .
    git fetch --unshallow
```

## Реализация своих полей

Что если нам нужно несколько полей для работы с датами, например, для даты публикации поста и для даты последнего обновления поста. Реализуем их сами и назовём как `publishedAt` и `updatedAt`.

Поле `updatedAt` будем вычислять через Git, а `publishedAt` будем задавать вручную в frontmatter-секции:

```markdown
---
publishedAt: 2024-1-30
---
```

Теперь нам нужно для дальнейшего удобства работы преобразовывать эти данные из строки в объекты `Date` и сортировать коллекции на этой основе.

Преобравазование даты можно выполнять в общем для всех статей data-файле. Например, если все статьи храняться в папке `articles`, то нужно создать в ней файл `articles.11tydata.js`:

```sh
articles
  |_ article1
    |_ index.md
  |_ article2
    |_ index.md
  articles.11tydata.js
```

Воспользуемся мощной функциональностью Eleventy - [вычисляемые поля `eleventyComputed`](https://www.11ty.dev/docs/data-computed/).

```javascript
// articles.11tydata.js
module.exprots = {
  eleventyComputed: {
    publishedAt(data) {
      if (!data.publishedAt) {
        return;
      }
      return new Date(data.publishedAt);
    }
  }
}
```

С помощью такой техники мы создаём новое одноимённое поле, которое получает доступ к старому строковому значению и возвращает объект типа `Date`. Отсортируем коллекцию постов так, чтобы сначала шли новые статьи. Воспользуемся [методами для работы с коллекциями](https://www.11ty.dev/docs/collections/#advanced-custom-filtering-and-sorting) внутри конфигурационного файла `eleventy.config.js`:

```javascript
module.exports = function(eleventyConfig) {
  eleventyConfig.addCollection('articles', (collectionAPI) => {
    return collectionAPI
      .getFilteredByGlob('src/articles/*/index.md')
      .toSorted((a, b) => b.data.publishedAt - a.data.publishedAt);
  });
}
```

Здесь мы ищем все нужные нам файлы статьей `index.md`, предполагая, что они хранятся внутри папки `src/articles`.

Для красивого форматирования дат внутри шаблонов можно создать свой [фильтр](https://www.11ty.dev/docs/filters/) или завести ещё одно вычисляемое поле в `articles.11tydata.js`:

```javascript
// articles.11tydata.js
module.exprots = {
  eleventyComputed: {
    formattedPublishDate(data) {
      if (!data.publishedAt) {
        return;
      }
      return date.toLocaleString('ru', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
  }
}
```

Наконец, можно отрендерить список статей (на примере шаблонизатора Nunjucks) с датой публикации:

```njk
<!-- index.njk -->
{% for article in collections.articles %}
  <article> 
   <h3>{{ article.data.title }}</h3>
   <time>{{ article.data.formattedPublishDate }}</time> 
  </article> 
{% endfor %}
```

Теперь реализуем поле `updatedAt`. В терминах Git это дата последнего коммита. Её можно вычислить с помощью такой команды:

```sh
git --no-pager log -n 1 --format="%ci <path>
```

В ней нужно будет заменить `<path>` на путь к нужному файлу или папке. Работать будем именно с папкой, содержащей статью, так как там могут быть и другие связанные с ней материалы, например, картинки. Их правки тоже стоит учитывать.

Будем запускать Git как внешний процесс через Node.js-модуль `child_process`. А завернём всё это снова в вычисляемое поле, которое можеть быть асинхронной функцией:

```javascript
// articles.11tydata.js
const path = require('node:path');
const util = require('node:util');
const { execFile } = require('node:child_process');

async function runCommand(command) {
  const [bin, ...args] = command.split(' ');
  const { stdout } = await util.promisify(execFile)(bin, args, {
    encoding: 'utf-8'
  });
  return stdout;
}

async function parseLastCommitDate(contentPath) {
  const command = `git --no-pager log -n 1 --format="%ci" ${contentPath}`;
  const date = (await runCommand(command)).trim();
  return date ? new Date(date) : null;
}

module.exports = {
  eleventyComputed: {
    updatedAt(data) {
      const contentPath = path.dirname(data.page.inputPath);
      return parseLastCommitDate(contentPath);
    }
  }
}
```

## Eleventy-плагин для работы с датами

Все вышеперечисленные идеи я завернул в [плагин](https://github.com/web-alchemy/eleventy-plugin-content-dates), добавив возможность использовать ключевые слова, подобные тем, что есть в Eleventy для `date`:

- `Date. FS. Created`
- `Date. FS. Last Modified`
- `Date. Git. Created`
- `Date. Git. Last Modified`

Названия говорят сами за себя. Указывать их можно как в frontmatter-разделе:

```njk
---
createdAt: 'Date. Git. Created'
updatedAt: 'Date. Git. Last Modified'
---

<time datetime="{{ createdAt.toISOString()}}">
  {{ createdAt.toLocaleDateString() }}
</time>

<time datetime="{{ updatedAt.toISOString()}}">
  {{ updatedAt.toLocaleDateString() }}
</time>
```

Так и в `11tydata`-файлах:

```javascript
const { TIMESTAMPS } = require('@web-alchemy/eleventy-plugin-content-dates');

module.exports = {
  createdAtWithFS: TIMESTAMPS.FS_CREATED,
  updatedAtWithFS: TIMESTAMPS.FS_LAST_MODIFIED,
  createdAtWithGit: TIMESTAMPS.GIT_CREATED,
  updatedAtWithGit: TIMESTAMPS.GIT_LAST_MODIFIED,
}
```

Функции из плагина можно использовать как библиотеку без необходимости регистрировать плагин. Подробнее в [README](https://github.com/web-alchemy/eleventy-plugin-content-dates?tab=readme-ov-file#low-level-usage-example) репозитория.