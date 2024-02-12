import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import esbuild from 'esbuild';

const extRegExp =  /\.(jsx|ts|tsx|mts|cts)$/;

async function getPackageType(url) {
  const isFilePath = !!path.extname(url);
  const dir = isFilePath ? path.dirname(fileURLToPath(url)) : url;
  const packagePath = path.resolve(dir, 'package.json');
  const type = await fs.promises.readFile(packagePath, { encoding: 'utf8' })
    .then((filestring) => JSON.parse(filestring).type)
    .catch((err) => {
      if (err?.code !== 'ENOENT') console.error(err);
    });
  if (type) {
    return type;
  };
  return dir.length > 1 && getPackageType(path.resolve(dir, '..'));
}

export async function load(url, context, nextLoad) {
  if (extRegExp.test(url)) {
    // const format = await getPackageType(url);
    const format = 'module';

    const loadResult = await nextLoad(url, {
      ...context,
      format
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
      format,
      shortCircuit: true,
    }
  }

  return nextLoad(url, context);
}