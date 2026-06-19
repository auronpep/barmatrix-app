import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/account",
        "/checkout/success",
        "/diagnostic/*",
        "/preview/*",
        "/dashboard",
        "/dashboard/*",
        "/drills",
        "/drills/*",
        "/boot-camps/sessions/*",
        "/study/*",
        "/flashcards/*",
      ],
    },
    sitemap: "https://barmatrix.app/sitemap.xml",
    host: "https://barmatrix.app",
  };
}
