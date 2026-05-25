import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export — produces an `out/` folder of pre-rendered HTML/CSS/JS that
  // any static host (Hostinger Business public_html via SFTP) can serve directly.
  // No Node runtime required at request time.
  output: "export",

  // Trailing slashes pair well with Apache (Hostinger) — every page lands as
  // `/<path>/index.html`, which the default DirectoryIndex resolves cleanly.
  trailingSlash: true,

  // next/image needs an image optimizer at runtime; static export cannot host one.
  // Until we add a CDN/loader, ship images unoptimized.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
