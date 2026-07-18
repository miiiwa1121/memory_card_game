import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// output: export（静的書き出し）でビルド時に sitemap.xml を生成するため必須
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/game`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
