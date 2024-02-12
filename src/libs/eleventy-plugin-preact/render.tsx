import type { ComponentChildren, VNode } from 'preact';
import { renderToString } from 'preact-render-to-string';

import type { EleventyContextType, PageComponent, DataType  } from './types.ts';
import { EleventyContextProvider } from './context.tsx';

export function renderElement(
  Component: PageComponent<DataType>,
  eleventyContext: EleventyContextType,
  children?: ComponentChildren
) {
  return (
    <EleventyContextProvider value={eleventyContext}>
      <Component data={eleventyContext.data}>
        {children}
      </Component>
    </EleventyContextProvider>
  )
}

export function renderPage(vnode: VNode) {
  return '<!DOCTYPE html>' + renderToString(vnode);
}