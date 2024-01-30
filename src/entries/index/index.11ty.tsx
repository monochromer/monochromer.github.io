import { useEleventyContext } from '@/libs/eleventy-plugin-preact/context';
import { ArticlePreview } from '@/components/article-preview/article-preview';
import { IndexBlock } from '@/components/index-block/index-block';
import { ArticleList } from '@/components/article-list/article-list';
import { Link } from '@/components/link/link';

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
                excerpt={<Content.Excerpt />}
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