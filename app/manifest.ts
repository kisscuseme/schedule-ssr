import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    theme_color: "#99aaf6",
    background_color: "#99aaf6",
    display: "minimal-ui",
    orientation: "portrait",
    scope: "/",
    start_url: "/",
    name: "스케쥴",
    short_name: "스케쥴",
    description: "Manage your schedule",
    icons: [
      {
        src: "/images/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/images/icons/icon-256x256.png",
        sizes: "256x256",
        type: "image/png",
      },
      {
        src: "/images/icons/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
      },
      {
        src: "/images/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
