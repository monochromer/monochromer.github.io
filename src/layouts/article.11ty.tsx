import { useEleventyContext } from '#root/libs/eleventy-plugin-preact/context.tsx';
import Article from '#root/components/article/article.tsx';

export const data = {
  layout: 'base'
}

export default function ArticlePage() {
  const { data } = useEleventyContext();
  const Content = data.content;

  return (
    <Article
      title={<Content.TitleContent />}
      publishedAt={data.publishedAt}
      updatedAt={data.updatedAt}
      excerpt={Content.Excerpt && <Content.Excerpt />}
      body={<Content.Body />}
    ></Article>
  )
}
