import { Link } from "@/components/link/link";
import { IndexBlock } from "@/components/index-block/index-block";

export const data = {
  title: 'О сайте',
  permalink: '/about/',
  layout: 'base'
}

export const AboutPage = () => {
  return (
    <IndexBlock title={'Контакты'}>
      <ul>
        <li>
          <Link href="https://t.me/drmonochromer" isExternal>Telegram</Link>
        </li>
        <li>
          <Link href="https://twitter.com/DrMonochromer" isExternal>Twitter</Link>
        </li>
        <li>
          <Link href="https://mastodon.social/@monochromer" isExternal>Mastodon</Link>
        </li>
        <li>
          <Link href="mailto:hwk85tkvs@relay.firefox.com" isExternal>E-mail</Link>
        </li>
      </ul>
    </IndexBlock>
  )
}

export default AboutPage;
