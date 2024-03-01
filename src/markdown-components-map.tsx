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

export default {
  'h1': createTitleComponent(1),
  'h2': createTitleComponent(2),
  'h3': createTitleComponent(3),
  'h4': createTitleComponent(4),
  'h5': createTitleComponent(5),
  'h6': createTitleComponent(6),
  'p': Paragraph,
  'a': (props) => {
    const { node } = props;
    const isExternal = node.href.startsWith('//') || node.href.startsWith('http://') || node.href.startsWith('https://');
    return (
      <Link className={clsx(props.className, props.node.className)} href={node.href} isExternal={isExternal}>
        {props.children}
      </Link>
    )
  },
  'code': InlineCode,
  'pre': (props) => {
    const { node } = props;
    const lang = node.getAttribute('data-lang');
    const code = unescape(node.firstChild.textContent);

    return (
      <CodeBlock
        className={clsx('article__code-block', props.className)}
        language={lang}
        codeText={code}
      />
    )
  },
  'hr': Divider,
  'li': ListItem,
  'ul': UnorderedList,
  'ol': OrderedList,
}