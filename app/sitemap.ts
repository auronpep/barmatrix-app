import type { MetadataRoute } from "next";

const ROUTES = [
  "/",
  "/about",
  "/how-it-works",
  "/pricing",
  "/diagnostic",
  "/red-zones",
  "/boot-camps",
  "/timed-sets",
  "/partners",
  "/faq",
  "/privacy",
  "/terms",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((route) => ({
    url: `https://barmatrix.app${route}`,
    lastModified: now,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
