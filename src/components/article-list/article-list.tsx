import { ComponentType } from "preact";

type ArticleListComponent = ComponentType & {
  Item: ComponentType;
}

export const ArticleList: ArticleListComponent = (props) => {
  return (
    <ol className="article-list">
      {props.children}
    </ol>
  )
}

export const ArticleListItem: ComponentType = (props) => {
  return (
    <li className="article-list__item">
      {props.children}
    </li>
  )
}

ArticleList.Item = ArticleListItem;

export default ArticleList;