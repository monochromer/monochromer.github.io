import { clsx } from "clsx";
import { ComponentType } from "preact";
import { type ShikiTransformer } from "shiki";
import { useEleventyContext } from "#root/libs/eleventy-plugin-preact/context.tsx";

const transformers: Array<ShikiTransformer> =[{
  root(node) {
    return {
      type: 'root',
      // @ts-ignore TODO: fix shiki types
      children: node.children[0].children[0].children
    }
  },
  line(node) {
    node.properties = {
      class: 'code-block__line'
    };
  },
}];

type CodeBlockProps = {
  className?: string;
  language?: string;
  codeText: string;
}

export const CodeBlock: ComponentType<CodeBlockProps> = (props) => {
  const { functions } = useEleventyContext();
  const { language, codeText, className } = props;

  const code = language ? functions.codeHighlight(codeText, language, {
    transformers
  }) : codeText;

  return (
    <pre className={clsx('code-block', className)} data-lang={language}>
      <code className={'code-block__content'} dangerouslySetInnerHTML={{ __html: code }} tabIndex={0} />
    </pre>
  )
}

export default CodeBlock;