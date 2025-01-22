import type { ComponentChildren, VNode } from 'preact';
import { renderToStringAsync } from 'preact-render-to-string';

import type { EleventyContextType, PageComponent, DataType  } from './types.ts';
import { EleventyContextProvider } from './context.tsx';

export function wrapComponentIntoContext(
  Component: PageComponent<DataType>,
  eleventyContext: EleventyContextType,
  children?: ComponentChildren
) {
  const props = {
    data: eleventyContext.data,
    get children() {
      return children
    }
  }
  return (
    <EleventyContextProvider value={eleventyContext}>
      <Component {...props} />
    </EleventyContextProvider>
  )
}

export async function renderPage(vnode: VNode) {
  return '<!DOCTYPE html>' + await renderToStringAsync(vnode);
}

export const renderToString = renderToStringAsync;