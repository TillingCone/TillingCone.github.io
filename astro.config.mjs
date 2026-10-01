// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Use the live GitHub Pages URL until a custom domain is approved.
  site: 'https://TillingCone.github.io',
  // No `base`: the repo is named <username>.github.io, so it serves from the domain root.
});
