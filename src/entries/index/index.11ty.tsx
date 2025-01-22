import { useEleventyContext } from '#root/libs/eleventy-plugin-preact/context.tsx';
import { IndexBlock } from '#root/components/index-block/index-block.tsx';
import { Link } from '#root/components/link/link.tsx';
import { ArticlePreviewList } from '#root/components/article-preview-list/article-preview-list.tsx';

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
      <ArticlePreviewList items={data.articlesToShow} />
    </IndexBlock>
  )
}
export default IndexPage;