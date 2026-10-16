import { defineConfig } from "blume";

// design.md substitutes Inter 300 for the licensed Waldenburg Light, so the
// display and body roles share one family and differ only in weight. Both
// roles load the same variant list, which keeps it to a single @font-face set.
const inter = {
  name: "Inter",
  weights: [300, 400, 500, 600],
};

export default defineConfig({
  deployment: {
    // The canonical URL of the deployed docs — sitemap, canonicals, Open Graph
    // cards, and llms.txt are all built from it. DOCS_SITE overrides it, which
    // is what preview deployments set.
    site: process.env.DOCS_SITE ?? "https://zoom-chat-adapter.vercel.app",
  },
  description:
    "Community Zoom Team Chat adapter for Chat SDK — channels, DMs, slash commands, and @-mentions through one Chat interface.",
  footer: {
    copyright: `© ${new Date().getFullYear()} zoom-chat-adapter contributors · MIT`,
    links: [
      { href: "https://www.npmjs.com/package/zoom-chat-adapter", label: "npm" },
      { href: "https://chat-sdk.dev", label: "Chat SDK" },
      { href: "https://marketplace.zoom.us", label: "Zoom Marketplace" },
    ],
    socials: {
      github: "https://github.com/aradhyacp/zoom-chat-adapter",
    },
  },
  github: {
    dir: "apps/docs",
    owner: "aradhyacp",
    repo: "zoom-chat-adapter",
  },
  markdown: {
    code: {
      icons: true,
      theme: {
        dark: "github-dark",
        light: "github-light",
      },
    },
  },
  navigation: {
    // The built-in chrome keeps the repository in the footer only; docs readers
    // reach for it from anywhere, so it also sits in the header.
    actions: [
      {
        href: "https://github.com/aradhyacp/zoom-chat-adapter",
        label: "GitHub",
      },
    ],
  },
  theme: {
    // Ink pill, not a saturated brand color (design.md: primary #292524).
    accent: { dark: "#fafaf9", light: "#292524" },
    action: "#292524",
    fonts: {
      body: inter,
      display: inter,
      mono: { name: "Geist Mono", weights: [400] },
    },
    mode: "light",
    radius: "md",
  },
  title: "zoom-chat-adapter",
});
