import module from 'node:module';

module.register(new URL('./loader.js', import.meta.url));
const { default: eleventyPlugin } = await import(new URL('./eleventy-plugin.jsx', import.meta.url));

export default eleventyPlugin;