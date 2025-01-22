import { useEleventyContext } from '#root/libs/eleventy-plugin-preact/context.tsx';
import { Page } from '#root/components/page/page.tsx';
import { Logo } from '#root/components/logo/logo.tsx';
import { Footer } from '#root/components/footer/footer.tsx';
import { Header } from '#root/components/header/header.tsx';
import { MainNav } from '#root/components/main-nav/main-nav.tsx';

export const BaseLayout = () => {
  const { data, functions } = useEleventyContext();
  const Content = data.content;

  functions.css(functions.include('src/entries/main.css'));
  functions.js(functions.include('src/components/page/page.client.js'), 'critical-js');

  return (
    <Page
      title={data.title}
      description={data.description}
      image={data.meta.siteBaseLink + '/assets/social-cover.png'}
      meta={data.meta}
      headSlot={
        <>
          <meta name="generator" content={data.eleventy.generator} />
          <link rel="me" href="https://mastodon.social/@monochromer" />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="apple-touch-icon" href="/icon-180.png" />
          <link rel="icon" href="/icon.svg" type="image/svg+xml" />
          <link rel="icon" href="/favicon.ico" sizes="32x32" />
          <link rel="alternate" href="/rss-feed.xml" type="application/rss+xml" title="Блог Monochromer"></link>
          <style>{functions.getBundle('css')}</style>
          <script>{functions.getBundle('js', 'critical-js')}</script>
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