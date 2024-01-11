import { ComponentType } from "preact";
import { clsx } from "clsx";

type ParagraphProps = {
  className?: string;
}

export const Paragraph: ComponentType<ParagraphProps> = (props) => {
  return (
    <p className={clsx("paragraph", props.className)}>
      {props.children}
    </p>
  )
}