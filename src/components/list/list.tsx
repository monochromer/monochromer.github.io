import type { ComponentProps, ComponentType, JSX } from "preact";
import { clsx } from "clsx";

export const ListItem: ComponentType<JSX.HTMLAttributes<HTMLLIElement>> = (props) => {
  const { children, className } = props;
  return (
    <li className={clsx("list__item", className)}>
      {children}
    </li>
  )
}

type BaseListComponent<ListType extends (HTMLOListElement | HTMLUListElement)> = ComponentType<JSX.HTMLAttributes<ListType>> & {
  Item: typeof ListItem;
}

export const OrderedList: BaseListComponent<HTMLOListElement> = (props) => {
  const { children, className} = props;
  return (
    <ol className={clsx("list", className)}>
      {children}
    </ol>
  )
}

OrderedList.Item = ListItem;

export const UnorderedList: BaseListComponent<HTMLUListElement> = (props) => {
  const { children, className } = props;
  return (
    <ul className={clsx("list", className)}>
      {children}
    </ul>
  )
}

UnorderedList.Item = ListItem;

const listMap: {
  [key in 'ul' | 'ol']: typeof OrderedList | typeof UnorderedList;
} = {
  ul: UnorderedList,
  ol: OrderedList
}

type listTypeMap = {
  'ul': typeof UnorderedList;
  'ol': typeof OrderedList;
}

type ListComponentProps<ListType extends 'ul' | 'ol' = 'ul'> = {
  as: ListType;
} & ComponentProps<listTypeMap[ListType]>;

type ListComponent = ComponentType<ListComponentProps> & {
  Item: typeof ListItem;
}

export const List: ListComponent = (props) => {
  const { children, as, ...restProps } = props;
  const Tag = listMap[as] || UnorderedList;

  return (
    <Tag {...restProps}>
      {children}
    </Tag>
  );
}

List.Item = ListItem;

export default List;