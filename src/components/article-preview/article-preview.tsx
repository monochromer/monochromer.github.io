import type { ComponentType, VNode } from 'preact';
import { dateToISO, formatDate } from '#root/libs/dates.ts';
import Title from '#root/components/title/title.tsx';
import { Link } from '#root/components/link/link.tsx';

type ArticlePreviewProps = {
  url: string;
  title: VNode;
  excerpt: VNode;
  publishedAt?: string;
}

export const ArticlePreview: ComponentType<ArticlePreviewProps> = (props) => {
  return (
    <article className="article-preview">
      <Title className="article-preview__title" level={3}>
        <Link className="article-preview__link" href={props.url}>
          {props.title}
        </Link>
      </Title>
      {props.publishedAt && (
        <time className="article-preview__date" dateTime={dateToISO(props.publishedAt)}>
          {formatDate(props.publishedAt)}
        </time>
      )}
      {props.excerpt &&(
        <div className="article-preview__excerpt">
          {props.excerpt}
        </div>
      )}
    </article>
  )
}

export default ArticlePreview;