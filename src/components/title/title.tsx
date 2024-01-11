import type { ComponentType } from 'preact';
import { clsx } from 'clsx';

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

type TitleProps = {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  as?: HeadingTag;
}


export const Title: ComponentType<TitleProps> = (props) => {
  const Tag: HeadingTag = props.as ?? `h${props.level}`;

  return (
    <Tag className={clsx('title', {[`title_level_${props.level}`]: props.level}, props.className)}>
      {props.children}
    </Tag>
  )
}

export default Title