import { clsx } from "clsx";
import { ComponentType } from "preact";
import { useEleventyContext } from "@/libs/eleventy-plugin-preact/context";

type CodeBlockProps = {
  className?: string;
  language?: string;
  codeText: string;
}

export const CodeBlock: ComponentType<CodeBlockProps> = (props) => {
  const { functions } = useEleventyContext();
  const { language, codeText, className } = props;

  const highlightCode = functions.codeHighlight(codeText, language, {
    elements: {
      pre(props) {
        return props.children;
      },
      code(props) {
        return props.children;
      },
      line(props) {
        return `<span class="code-block__line">${props.children}</span>`;
      },
      token(props) {
        return `<span style="${props.style}">${props.children}</span>`;
      }
    }
  })

  return (
    <pre className={clsx('code-block', className)} data-lang={language}>
      <code className={'code-block__content'} dangerouslySetInnerHTML={{ __html: highlightCode }} tabIndex={0} />
    </pre>
  )
}

export default CodeBlock;