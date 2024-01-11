import { ComponentChild, ComponentType } from 'preact';
import { dateToISO, formatDate } from '@/libs/dates';
import { Title } from '@/components/title/title';

type ArticleProps = {
  title: ComponentChild;
  publishedAt: string | Date;
  excerpt?: ComponentChild;
  body: ComponentChild;
}

export const Article: ComponentType<ArticleProps> = (props) => {
  return (
    <article className={'article'}>
      <header className="article__header">
        <Title className="article__title" level={1}>
          {props.title}
        </Title>
        <time className={'article__date'} dateTime={dateToISO(props.publishedAt)}>
          {formatDate(props.publishedAt)}
        </time>
        {props.excerpt && (
          <div className="article__excerpt">
            {props.excerpt}
          </div>
        )}
      </header>
      <div className="article__body">
        {props.body}
      </div>
    </article>
  )
}

export default Article;