import ArticleList from '#root/components/article-list/article-list.tsx';
import ArticlePreview from '#root/components/article-preview/article-preview.tsx';
import ComponentsMap from '#root/components/markdown-components-map.tsx';

type ArticlePreviewListProps = {
  items: Array<any>;
}

export const ArticlePreviewList = (props: ArticlePreviewListProps) => {
  return (
    <ArticleList>
      {props.items.map((article) => {
        const Content = article.content;
        return (
          <ArticleList.Item>
            <ArticlePreview
              url={article.data.page.url}
              title={<Content.TitleContent components={ComponentsMap} />}
              excerpt={Content.Excerpt ? <Content.Excerpt components={ComponentsMap} /> : article.data.description}
              publishedAt={article.data.publishedAt}
            />
          </ArticleList.Item>
        )
      })}
    </ArticleList>
  )
}