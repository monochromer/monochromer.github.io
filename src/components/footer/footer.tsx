import type { ComponentType } from 'preact'
import { clsx } from 'clsx';
import { Link } from '#root/components/link/link.tsx';

interface FooterProps {
  buildYear: string;
  className?: string;
}

export const Footer: ComponentType<FooterProps> = (props) => {
  return (
    <footer className={clsx("footer", props.className)}>
      <small className="footer__copy">
        ©monochromer, {props.buildYear}
      </small>
      <Link href={'/rss-feed.xml'}>RSS</Link>
    </footer>
  )
}
export default Footer;
