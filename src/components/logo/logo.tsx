import type { ComponentType } from 'preact';
import { clsx } from 'clsx';

interface LogoProps {
  hiddenText: string;
  className?: string;
}

export const Logo: ComponentType<LogoProps> = (props) => {
  return (
    <a className={clsx("logo", props.className)} href="/" aria-label={props.hiddenText}>
      <img className="logo__image" src="/icon.svg" width="48" height="48" alt="Логотип сайта" />
    </a>
  )
}

export default Logo