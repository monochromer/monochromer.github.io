import { ComponentChild, ComponentType, VNode } from "preact";

type ArticleMetaItemProps = {
  name: ComponentChild;
}

export const ArticleMetaItem: ComponentType<ArticleMetaItemProps> = (props) => {
  return (
    <div className='article-meta__item'>
      <dt className='article-meta__key'>{props.name}:</dt>
      <dd className='article-meta__value'>{props.children}</dd>
    </div>
  );
}

type ArticleMetaComponent = ComponentType & {
  Item: typeof ArticleMetaItem;
}

export const ArticleMeta: ArticleMetaComponent = (props) => {
  return (
    <dl className={'article-meta'}>
      {props.children}
    </dl>
  );
}

ArticleMeta.Item = ArticleMetaItem;

export default ArticleMeta;