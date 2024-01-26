import { useEleventyContext } from '@/libs/eleventy-plugin-preact/context';
import { Page } from '@/components/page/page';
import { Logo } from '@/components/logo/logo';
import { Footer } from '@/components/footer/footer';
import { Header } from '@/components/header/header';
import { MainNav } from '@/components/main-nav/main-nav';

export const BaseLayout = () => {
  const { data, functions } = useEleventyContext();
  const Content = data.content;

  return (
    <Page
      title={data.title}
      description={data.description}
      image={null}
      meta={data.meta}
      headSlot={
        <>
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="apple-touch-icon" href="/icon-180.png" />
          <link rel="icon" href="/icon.svg" type="image/svg+xml" />
          <link rel="icon" href="/favicon.ico" sizes="32x32" />
          <link rel="alternate" href="/rss-feed.xml" type="application/rss+xml" title="Блог Monochromer"></link>
          <script>{functions.getCriticalJSContent()}</script>
          <style>{functions.getMainStylesContent()}</style>
        </>
      }
    >
      <Header className="page__header">
        <Logo className="header__logo" hiddenText='Главная страница' />
        <MainNav
          className="header__nav"
          items={[
            { text: 'Статьи', link: '/articles/'},
            { text: 'О сайте', link: '/about/'},
          ]}
        />
      </Header>
      <main className="page__main">
        <Content />
      </main>
      <Footer className="page__footer" buildYear={data.meta.buildYear} />
    </Page>
  )
}

export default BaseLayout;