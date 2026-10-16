import { defineComponents } from "blume";
import AtmosphericCard from "./components/atmospheric-card.astro";
import Band from "./components/band.astro";
import FeatureGrid from "./components/feature-grid.astro";
import HeroBand from "./components/hero-band.astro";
import SiteFooter from "./components/site-footer.astro";
import SiteLogo from "./components/site-logo.astro";
import SupportLedger from "./components/support-ledger.astro";
import ZoomThread from "./components/zoom-thread.astro";

export default defineComponents({
  layout: {
    Footer: SiteFooter,
    Logo: SiteLogo,
  },
  mdx: {
    AtmosphericCard,
    Band,
    FeatureGrid,
    HeroBand,
    SiteFooter,
    SupportLedger,
    ZoomThread,
  },
});
