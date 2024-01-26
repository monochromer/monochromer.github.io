import { clsx } from 'clsx';
import { unescape } from 'html-escaper';
import { Title } from '@/components/title/title';
import { Paragraph } from '@/components/paragraph/paragraph';
import { CodeBlock } from '@/components/code-block/code-block';
import { Link } from '@/components/link/link';
import { InlineCode } from '@/components/inline-code/inline-code';
import { AnchorTitle } from '@/components/anchor-title/anchor-title';
import { Divider } from '@/components/divider/divider';
import { OrderedList, UnorderedList, ListItem } from '@/components/list/list';

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
    const isCodeBlock = node.hasAttribute('data-lang');
    const lang = node.getAttribute('data-lang');
    const code = unescape(node.firstChild.textContent);

    return isCodeBlock
      ? <CodeBlock className={clsx('article__code-block', props.className)} language={lang} codeText={code}/>
      : null
  },
  'hr': Divider,
  'li': ListItem,
  'ul': UnorderedList,
  'ol': OrderedList,
}