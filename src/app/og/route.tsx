/**
 * Dynamic Open Graph (OG) Image Generation Route
 *
 * This Next.js App Router Route Handler dynamically creates social preview cards
 * (Open Graph images) for links shared across platforms like Twitter/X, LinkedIn, and Discord.
 * It uses `@vercel/og` (via `next/og`) to convert JSX and CSS into a PNG image at runtime.
 */

import { ImageResponse } from "next/og";
import { baseURL } from "@/app/resources";
import { person } from "@/app/resources/content";

// Execute on the Edge runtime for minimal cold-start latency and faster image rendering.
export const runtime = "edge";

/**
 * Handles GET requests to generate the dynamic OG preview image.
 *
 * @param request - The incoming HTTP Request object containing the URL and query parameters.
 * @returns An ImageResponse containing the generated PNG image.
 */
export async function GET(request: Request) {
  // Extract custom title parameter from search query (e.g., /og?title=My+Project),
  // falling back to "Portfolio" if omitted.
  let url = new URL(request.url);
  let title = url.searchParams.get("title") || "Portfolio";

  // Load custom Inter font asset as an ArrayBuffer to render styled text in the image.
  // Note: @vercel/og (powered by Satori) requires raw ArrayBuffer font data in TTF, OTF, or WOFF format (WOFF2 is unsupported).
  const font = fetch(new URL("../../../public/fonts/Inter.ttf", import.meta.url)).then((res) =>
    res.arrayBuffer(),
  );
  const fontData = await font;

  // Render the visual layout to an ImageResponse (PNG) with 1920x1080 resolution.
  // Satori compiles JSX into SVG before converting to PNG, supporting a strict subset of CSS (primarily Flexbox).
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        padding: "8rem",
        background: "#151515",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "4rem",
          fontFamily: "Inter",
          fontStyle: "normal",
          color: "white",
        }}
      >
        {/* Dynamic page/post title */}
        <span
          style={{
            fontSize: "8rem",
            lineHeight: "8rem",
            letterSpacing: "-0.05em",
            whiteSpace: "pre-wrap",
            textWrap: "balance",
          }}
        >
          {title}
        </span>

        {/* Author / Owner profile branding footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5rem",
          }}
        >
          {/* Avatar image - requires an absolute URL with protocol (https://) for ImageResponse / Satori fetching */}
          <img
            src={"https://" + baseURL + person.avatar}
            style={{
              width: "12rem",
              height: "12rem",
              objectFit: "cover",
              borderRadius: "100%",
            }}
          />

          {/* Author name and role */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            <span
              style={{
                fontSize: "4.5rem",
                lineHeight: "4.5rem",
                whiteSpace: "pre-wrap",
                textWrap: "balance",
              }}
            >
              {person.name}
            </span>
            <span
              style={{
                fontSize: "2.5rem",
                lineHeight: "2.5rem",
                whiteSpace: "pre-wrap",
                textWrap: "balance",
                opacity: "0.6",
              }}
            >
              {person.role}
            </span>
          </div>
        </div>
      </div>
    </div>,
    {
      // Output image specifications
      width: 1920,
      height: 1080,
      fonts: [
        {
          name: "Inter",
          data: fontData,
          style: "normal",
        },
      ],
    },
  );
}

