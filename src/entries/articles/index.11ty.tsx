import { useEleventyContext } from "@/libs/eleventy-plugin-preact/context";
import { ArticleList } from "@/components/article-list/article-list";
import { ArticlePreview } from "@/components/article-preview/article-preview";
import { IndexBlock } from "@/components/index-block/index-block";

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
                excerpt={<Content.Excerpt />}
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