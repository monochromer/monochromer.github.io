import { clsx } from 'clsx';
import { unescape } from 'html-escaper';
import { Title } from '#root/components/title/title.tsx';
import { Paragraph } from '#root/components/paragraph/paragraph.tsx';
import { CodeBlock } from '#root/components/code-block/code-block.tsx';
import { Link } from '#root/components/link/link.tsx';
import { InlineCode } from '#root/components/inline-code/inline-code.tsx';
import { AnchorTitle } from '#root/components/anchor-title/anchor-title.tsx';
import { Divider } from '#root/components/divider/divider.tsx';
import { OrderedList, UnorderedList, ListItem } from '#root/components/list/list.tsx';

import { type ComponentsMap } from '#root/libs/eleventy-plugin-preact/makrdown-content.tsx';

function createTitleComponent(level) {
  return (props) => {
    const titleNode = (
      <Title className={clsx(props.className, props.node.className)} level={props.level ?? level}>
        {props.children}
      </Title>
    );

    return level === 1
      ? titleNode
      : (
        <AnchorTitle text={props.node.textContent} level={level}>
          {titleNode}
        </AnchorTitle>
      )
  }
}

const componentsMap: ComponentsMap = {
  'H1': createTitleComponent(1),
  'H2': createTitleComponent(2),
  'H3': createTitleComponent(3),
  'H4': createTitleComponent(4),
  'H5': createTitleComponent(5),
  'H6': createTitleComponent(6),
  'P': (props) => <Paragraph>{props.children}</Paragraph>,
  'A': (props) => {
    const { node } = props;
    const isExternal = ['//', 'http://', 'https://'].some((v) => node.href.startsWith(v));
    return (
      <Link className={clsx(props.node.className)} href={node.href} isExternal={isExternal}>
        {props.children}
      </Link>
    )
  },
  'CODE': props => <InlineCode>{props.children}</InlineCode>,
  'PRE': (props) => {
    const { node } = props;
    const lang = node.getAttribute('data-lang');
    const code = unescape(node.firstChild.textContent);

    return (
      <CodeBlock
        className={'article__code-block'}
        language={lang}
        codeText={code}
      />
    )
  },
  'HR': Divider,
  'LI': props => <ListItem>{props.children}</ListItem>,
  'UL': props => <UnorderedList>{props.children}</UnorderedList>,
  'OL': props => <OrderedList>{props.children}</OrderedList>,
}

export default componentsMap;