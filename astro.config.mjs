import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), sitemap()],
  site: "https://joshuaakanetuk.com",
  redirects: {
    '/blog/how-to-user-google-calendar-py': '/blog/how-to-use-google-calendar-py'
  }
});
