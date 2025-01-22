import { Link } from "#root/components/link/link.tsx";
import { IndexBlock } from "#root/components/index-block/index-block.tsx";
import { UnorderedList } from "#root/components/list/list.tsx";
import { useEleventyContext } from '#root/libs/eleventy-plugin-preact/context.tsx';

export const data = {
  title: 'О сайте',
  permalink: '/about/',
  layout: 'base'
}

export const AboutPage = () => {
  return (
    <>
      <IndexBlock title={'Контакты'}>
        <UnorderedList>
          <UnorderedList.Item>
            <Link href="https://t.me/drmonochromer" isExternal>Telegram</Link>
          </UnorderedList.Item>
          <UnorderedList.Item>
            <Link href="https://twitter.com/DrMonochromer" isExternal>Twitter</Link>
          </UnorderedList.Item>
          <UnorderedList.Item>
            <Link href="https://mastodon.social/@monochromer" isExternal>Mastodon</Link>
          </UnorderedList.Item>
          <UnorderedList.Item>
            <Link href="mailto:hwk85tkvs@relay.firefox.com" isExternal>E-mail</Link>
          </UnorderedList.Item>
          <UnorderedList.Item>
            <Link href="https://github.com/monochromer" isExternal>Github</Link>
          </UnorderedList.Item>
        </UnorderedList>
      </IndexBlock>

      <IndexBlock title={'Ссылки'}>
        <UnorderedList>
          <UnorderedList.Item>
            <Link href="https://github.com/monochromer/monochromer.github.io" isExternal>Репозиторий блога на Github</Link>
          </UnorderedList.Item>
          <UnorderedList.Item>
            <Link href="/rss-feed.xml">RSS-лента с последними статьями</Link>
          </UnorderedList.Item>
        </UnorderedList>
      </IndexBlock>
    </>
  )
}

export default AboutPage;
