import esbuild from 'esbuild';

const extRegExp =  /\.(jsx|ts|tsx|mts)$/;
const externalModuleRegExp = /\/node_modules\//;

export async function load(url, context, nextLoad) {
  if (externalModuleRegExp.test(url)) {
    return nextLoad(url, context);
  }

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