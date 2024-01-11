import { clsx } from 'clsx';
import { ComponentType } from 'preact';

type LinkProps = {
  href: string;
  isExternal?: boolean;
  className?: string;
}

export const Link: ComponentType<LinkProps> = (props) => {
  const externalProps = props.isExternal ? {
    target: '_blank',
    rel: 'noopener noreferrer'
  } : null;
  return (
    <a className={clsx('link', props.className)} href={props.href} {...externalProps}>
      {props.children}
    </a>
  )
}

export default Link;