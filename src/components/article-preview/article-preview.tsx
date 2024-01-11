import type { ComponentType, VNode } from 'preact';
import { dateToISO, formatDate } from '@/libs/dates';
import Title from '@/components/title/title';
import { Link } from '@/components/link/link';

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