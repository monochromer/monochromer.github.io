import type { ComponentType, ComponentChild } from 'preact';

interface PageProps {
  title: string;
  description?: string;
  image?: string;
  meta: {
    buildYear: string;
  },
  headSlot: ComponentChild
}

export const Page: ComponentType<PageProps> = (props) => {
  return (
    <html className="page" lang="ru">
      <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{props.title}</title>
        <meta property="og:title" content={props.title} />
        {props.description && (
          <meta property="og:description" name="description" content={props.description} />
        )}
        {props.image && (
          <>
            <meta name="twitter:card" content="summary_large_image" />
            <meta property="og:image" content={props.image} />
          </>
        )}
        {props.headSlot}
      </head>
      <body className="page__body">
        {props.children}
      </body>
    </html>
  )
}

export default Page;