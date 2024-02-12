import { ComponentChild, ComponentType } from 'preact';
import { Title } from '#root/components/title/title.tsx';

type IndexBlockProps = {
  title: ComponentChild;
  footer?: ComponentChild;
}

export const IndexBlock: ComponentType<IndexBlockProps> = (props) => {
  return (
    <section className="index-block">
      <Title className="index-block__title" as="h2" level={1}>
        {props.title}
      </Title>

      {props.children}

      {props.footer && (
        <div className="index-block__footer">
          {props.footer}
        </div>
      )}
    </section>
  )
}

export default IndexBlock;