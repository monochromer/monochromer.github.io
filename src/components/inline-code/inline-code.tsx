import { clsx } from 'clsx';
import { ComponentType } from 'preact';

type InlineCodeProps = {
  className?: string;
}

export const InlineCode: ComponentType<InlineCodeProps> = (props) => {
  return (
    <code className={clsx('inline-code', props.className)}>
      {props.children}
    </code>
  )
}

export default InlineCode;