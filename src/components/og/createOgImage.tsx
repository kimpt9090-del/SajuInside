import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

export function createOgImage(title: string, subtitle: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #18181b 0%, #3f3f46 100%)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 28, opacity: 0.85 }}>테스트/사주/유형</div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            marginTop: 16,
            lineHeight: 1.15,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 32, marginTop: 24, opacity: 0.9, maxWidth: 900 }}>
          {subtitle}
        </div>
      </div>
    ),
    { ...ogSize },
  );
}
