import { ComponentType, JSX } from 'preact';

interface VisuallyHiddenProps {
  tag?: keyof JSX.IntrinsicElements;
}

export const VisuallyHidden: ComponentType<VisuallyHiddenProps> = (props) => {
  const { tag: Tag = 'span' } = props;
  return (
    <Tag className="visually-hidden">
      {props.children}
    </Tag>
  )
}

export default VisuallyHidden;