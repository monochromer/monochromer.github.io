import { ComponentType } from 'preact';
import { clsx } from 'clsx';
import { useEleventyContext } from '@/libs/eleventy-plugin-preact/context';
import { VisuallyHidden } from '@/components/visually-hidden/visually-hidden';

type AnchorTitleProps = {
  text: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

export const AnchorTitle: ComponentType<AnchorTitleProps> = (props) => {
  const { functions } = useEleventyContext();
  const slug = functions.slugify(props.text);
  const hint = 'Cсылка на данный раздел: ' + props.text;

  return (
    <div className="anchor-title" id={slug}>
      {props.children}
      <a className={clsx("anchor-title__link", "title", { [`title_level_${props.level}`]: props.level })} href={'#' + slug} title={hint}>
        <div className="anchor-title__symbol" aria-hidden="true">#</div>
        <VisuallyHidden>{hint}</VisuallyHidden>
      </a>
    </div>
  )
}