import type { ComponentType } from 'preact';
import { clsx } from 'clsx';

interface MainNavItem {
  link: string;
  text: string;
}

interface MainNavProps {
  className?: string;
  items: Array<MainNavItem>;
}

export const MainNav: ComponentType<MainNavProps> = (props) => {
  return (
    <nav className={clsx("main-nav", props.className)}>
      <ul className="main-nav__list">
        {props.items.map((item) => (
          <li className="main-nav__item" key={item.link}>
            <a className="main-nav__link" href={item.link}>
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default MainNav;