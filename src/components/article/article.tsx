import { ComponentChild, ComponentType } from 'preact';
import { dateToISO, formatDate, getDatesDiff } from '#root/libs/dates.ts';
import { Title } from '#root/components/title/title.tsx';
import ArticleMeta from '#root/components/article-meta/article-meta.tsx';

type ArticleProps = {
  title: ComponentChild;
  publishedAt: string | Date;
  updatedAt: string | Date;
  excerpt?: ComponentChild;
  body: ComponentChild;
}

function needShowUpdatedDate(date1: string | Date, date2: string | Date) {
  const ONE_DAY = 1000 * 60 * 60 * 24;
  return getDatesDiff(date1, date2) >= ONE_DAY
}

export const Article: ComponentType<ArticleProps> = (props) => {
  const showUpdatedDate = needShowUpdatedDate(props.publishedAt, props.updatedAt);

  return (
    <article className={'article'}>
      <header className="article__header">
        <Title className="article__title" level={1}>
          {props.title}
        </Title>
        <ArticleMeta>
          <ArticleMeta.Item name={'Опубликовано'}>
            <time dateTime={dateToISO(props.publishedAt)}>
              {formatDate(props.publishedAt)}
            </time>
          </ArticleMeta.Item>
          {showUpdatedDate && (
            <ArticleMeta.Item name={'Обновлено'}>
              <time dateTime={dateToISO(props.updatedAt)}>
                {formatDate(props.updatedAt)}
              </time>
            </ArticleMeta.Item>
          )}
        </ArticleMeta>
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