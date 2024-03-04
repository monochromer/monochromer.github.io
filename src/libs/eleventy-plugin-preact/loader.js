import esbuild from 'esbuild';

const extRegExp =  /\.(jsx|ts|tsx|mts|cts)$/;

export async function load(url, context, nextLoad) {
  if (!extRegExp.test(url)) {
    return nextLoad(url, context);
  }

  const loadResult = await nextLoad(url, {
    ...context,
    format: 'module'
  });

  const source = await esbuild.transform(loadResult.source, {
    jsx: 'automatic',
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    jsxImportSource: 'preact',
    loader: 'tsx'
  });

  return {
    source: source.code,
    format: 'module',
    shortCircuit: true,
  }
}