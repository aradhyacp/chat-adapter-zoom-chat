/**
 * Blume wires the favicon and the Apple touch icon by filename convention, but
 * it has no hook for a web-app manifest link, and its favicon detection emits a
 * single <link rel="icon"> (the SVG, which wins by convention) — which leaves
 * Google without a raster favicon. So this Astro integration appends the
 * manifest and the .ico/.png icon links to every built page's <head>.
 *
 * Paths are root-relative, which holds while `deployment.base` is unset.
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const HEAD_TAGS = [
  '<link rel="icon" href="/favicon.ico" sizes="any" />',
  '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />',
  '<link rel="manifest" href="/site.webmanifest" />',
].join("\n    ");

const htmlFiles = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) {
        return htmlFiles(path);
      }
      return Promise.resolve(entry.name.endsWith(".html") ? [path] : []);
    })
  );
  return nested.flat();
};

const addHeadTags = async (file) => {
  const html = await readFile(file, "utf8");
  if (!html.includes("</head>") || html.includes('rel="manifest"')) {
    return false;
  }
  await writeFile(file, html.replace("</head>", `  ${HEAD_TAGS}\n  </head>`));
  return true;
};

export default function seoHead() {
  return {
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        const files = await htmlFiles(fileURLToPath(dir));
        const patched = (await Promise.all(files.map(addHeadTags))).filter(
          Boolean
        ).length;
        logger.info(
          `seo-head: added manifest + icon links to ${patched} page(s)`
        );
      },
    },
    name: "zoom-chat-adapter:seo-head",
  };
}
