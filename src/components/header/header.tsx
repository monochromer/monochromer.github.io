import type { ComponentType } from 'preact';
import { clsx } from 'clsx';

interface HeaderProps {
  className?: string;
}

export const Header: ComponentType<HeaderProps> = (props) => {
  return (
    <header className={clsx("header", props.className)}>
      {props.children}
    </header>
  )
}

export default Header;