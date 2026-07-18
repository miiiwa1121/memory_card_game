import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// output: export（静的書き出し）でビルド時に robots.txt を生成するため必須
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
