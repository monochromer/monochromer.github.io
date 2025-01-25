import { type ComponentChildren, type AnyComponent } from 'preact';
import { Node as LinkeDOMNode } from 'linkedom';

export type PropsType<NodeType extends Node> = {
  node: NodeType;
  children?: ComponentChildren;
}

export type BaseComponent<NodeType extends Node = Node> = AnyComponent<PropsType<NodeType>>;

export type BaseElementComponent<ElementType extends Element = Element> = BaseComponent<ElementType>;

export type BaseHTMLElementComponent<ElementType extends HTMLElement = HTMLElement> = BaseComponent<ElementType>;

export type BaseSVGElementComponent<ElementType extends SVGElement = SVGElement> = BaseComponent<ElementType>;

export type BaseMathMLElementComponent<ElementType extends MathMLElement = MathMLElement> = BaseComponent<ElementType>;

export type HTMLElementRecord = Record<string, HTMLElement>;

type SpecialComponentsMap = Partial<{
  html: BaseComponent<DocumentType>;
 '#text': BaseComponent<Text>;
 '#comment': BaseComponent<Comment>;
}>

type HTMLElementComponentsMap = {
 [TagName in Uppercase<keyof HTMLElementTagNameMap>]?: BaseHTMLElementComponent<HTMLElementTagNameMap[Lowercase<TagName>]>;
}

type SVGElementComponentsMap = {
 [TagName in keyof SVGElementTagNameMap]?: BaseSVGElementComponent<SVGElementTagNameMap[TagName]>;
}

type MathMLElementComponentsMap = {
 [TagName in keyof MathMLElementTagNameMap]?: BaseMathMLElementComponent<MathMLElementTagNameMap[TagName]>;
}

type CustomElementsComponentsMap<CustomElementsTagNameMap extends HTMLElementRecord> = {
 [TagName in keyof CustomElementsTagNameMap]?: BaseHTMLElementComponent<CustomElementsTagNameMap[TagName]>
};

export type ComponentsMap<CustomElementsTagNameMap extends HTMLElementRecord = {}> =
 & SpecialComponentsMap
 & HTMLElementComponentsMap
 & SVGElementComponentsMap
 & MathMLElementComponentsMap
 & CustomElementsComponentsMap<CustomElementsTagNameMap>
;

type MarkdownComponent = AnyComponent<{
  node: Node;
  children?: ComponentChildren;
}>;

/*
// example with custom elements:
class CustomImage extends HTMLImageElement {}
class SomeCustomElement extends HTMLElement {}

type CustomElementsTagNameMap = {
  'C-IMAGE': CustomImage;
  'TURBO-FRAME': SomeCustomElement;
};

const componentsMap: ComponentsMap<CustomElementsTagNameMap> = {
  H1: (props) => `<h1 class="title">${props.node.textContent}</h1>`,
  IMG: (props) => `<picture><img src="${props.node.src}"></picture>`,
  'C-IMAGE': (props) => props.node.src,
  'TURBO-FRAME': () => null,
};
*/

const defaultComponents: Partial<SpecialComponentsMap> = {
  '#text': (props) => <>{props.node.textContent}</>,
  '#comment': () => null,
}

function attrsToObject(attrs: NamedNodeMap) {
  return Object.fromEntries([...attrs].map((attr) => [attr.name, attr.value]));
}

const FallbackComponent: BaseComponent = (props) => {
  const { node, children } = props;

  switch (true) {
    // @ts-ignore
    case (node.nodeType === LinkeDOMNode.ELEMENT_NODE): {
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
  components?: ComponentsMap;
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