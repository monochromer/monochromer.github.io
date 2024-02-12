import { useEleventyContext } from "#root/libs/eleventy-plugin-preact/context.tsx";
import { ArticleList } from "#root/components/article-list/article-list.tsx";
import { ArticlePreview } from "#root/components/article-preview/article-preview.tsx";
import { IndexBlock } from "#root/components/index-block/index-block.tsx";

export const data = {
  layout: 'base',
  title: 'Все статьи',
  permalink: '/articles/',
}

export const ArticlesPage = () => {
  const { data } = useEleventyContext();

  return (
    <IndexBlock title={data.title}>
      <ArticleList>
        {data.collections.articles.map((article) => {
          const Content = article.content;
          return (
            <ArticleList.Item>
              <ArticlePreview
                url={article.data.page.url}
                title={<Content.TitleContent />}
                excerpt={article.data.excerptElements?.length > 0 ? <Content.Excerpt /> : article.data.description}
                publishedAt={article.data.publishedAt}
              />
            </ArticleList.Item>
          )
        })}
      </ArticleList>
    </IndexBlock>
  );
}

export default ArticlesPage;