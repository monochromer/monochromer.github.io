import { useEleventyContext } from '#root/libs/eleventy-plugin-preact/context.tsx';
import { IndexBlock } from '#root/components/index-block/index-block.tsx';
import { ArticlePreviewList } from '#root/components/article-preview-list/article-preview-list.tsx';

export const data = {
  layout: 'base',
  title: 'Все статьи',
  permalink: '/articles/',
}

export const ArticlesPage = () => {
  const { data } = useEleventyContext();

  return (
    <IndexBlock title={data.title}>
      <ArticlePreviewList items={data.collections.articles} />
    </IndexBlock>
  );
}

export default ArticlesPage;