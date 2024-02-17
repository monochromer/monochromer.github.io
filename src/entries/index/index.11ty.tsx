import { useEleventyContext } from '#root/libs/eleventy-plugin-preact/context.tsx';
import { ArticlePreview } from '#root/components/article-preview/article-preview.tsx';
import { IndexBlock } from '#root/components/index-block/index-block.tsx';
import { ArticleList } from '#root/components/article-list/article-list.tsx';
import { Link } from '#root/components/link/link.tsx';

export const data = {
  permalink: '/',
  layout: 'base',
  title: 'Главная страница',
  articlesCountToDisplay: 5,
  eleventyComputed: {
    articlesToShow(data) {
      const articlesCollection = data?.collections?.articles;
      if (!articlesCollection || !articlesCollection.length) {
        return null;
      }
      if (!articlesCollection || !articlesCollection.length) {
        return null;
      }
      return articlesCollection.slice(0, data.articlesCountToDisplay);
    },

    needShowAllArticlesLink(data) {
      const articlesCollection = data?.collections?.articles;
      const { articlesToShow } = data;
      return articlesToShow.length > articlesCollection.length;
    }
  }
}

 const IndexPage = () => {
  const { data } = useEleventyContext();

  return (
    <IndexBlock
      title={'Последние статьи'}
      footer={
        data.needShowAllArticlesLink
          ? <Link href="/articles/">Все статьи</Link>
          : null
      }
    >
      <ArticleList>
        {data.articlesToShow.map((article) => {
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
  )
}
export default IndexPage;