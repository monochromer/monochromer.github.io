import { type ComponentChildren, type AnyComponent } from 'preact';
import { Node } from 'linkedom';

type MarkdownComponent = AnyComponent<{
  node: Node;
  children?: ComponentChildren;
}>;

// TODO: refactor or continue list
type ComponentKey =
  | '#text'
  | '#comment'
  | 'html'
  | 'SPAN'
  | 'DIV'
  | 'HTML'
  | 'HEAD'
  | 'TITLE'
  | 'META'
  | 'LINK'
  | 'STYLE'
  | 'SCRIPT'
  | 'NOSCRIPT'
  | 'BODY'
  | 'HEADER'
  | 'FOOTER'
  | 'MAIN'
  | 'H1'
  | 'H2'
  | 'H3'
  | 'H4'
  | 'H5'
  | 'H6'
  | 'P'
  | 'A'
  | 'B'
  | 'CODE'
  | 'PRE'
  | 'IMG'
  | 'PICTURE'
  | 'UL'
  | 'OL'
  | string
;

type ComponentsMap = Record<ComponentKey, MarkdownComponent>;

const defaultComponents: Partial<ComponentsMap> = {
  '#text': (props) => <>{props.node.textContent}</>,
  '#comment': () => null,
}

function attrsToObject(attrs: NamedNodeMap) {
  return Object.fromEntries([...attrs].map((attr) => [attr.name, attr.value]))
}

const FallbackComponent: MarkdownComponent = (props) => {
  const { node, children } = props;

  switch (true) {
    // @ts-ignore
    case (node.nodeType === Node.ELEMENT_NODE): {
      const Tag = node.nodeName.toLowerCase() as any;
      const passProps = attrsToObject((node as Element).attributes);
      return (
        <Tag {...passProps}>
          {children}
        </Tag>
      );
    }
    default: {
      return null;
    }
  }
}

type MarkdownContentProps = {
  nodes: NodeList;
  components?: ComponentsMap
}

export const MarkdownContent = (props: MarkdownContentProps) => {
  const userComponents = props.components ?? {};

  const getComponent = (key) => {
    return userComponents?.[key] ?? defaultComponents?.[key] ?? FallbackComponent;
  }

  const renderNodes = (childNodes: NodeList) => {
    return [...childNodes].map((node) => <NodeComponent node={node} />);
  }

  const NodeComponent: MarkdownComponent = ({ node }) => {
    const key = node.nodeName;
    const Component = getComponent(key);
    const props = {
      node,
      get children() {
        return renderNodes(node.childNodes)
      }
    }
    return (
      <Component {...props} />
    )
  }

  return props.nodes ? renderNodes(props.nodes) : null;
}