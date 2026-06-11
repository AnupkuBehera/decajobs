import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "DecaJobs - 10 Perfect Jobs Every Morning";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          backgroundImage:
            "linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #f0fdf4 100%)",
          padding: "60px",
        }}
      >
        {/* Brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              backgroundColor: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "16px",
            }}
          >
            <span style={{ color: "#ffffff", fontSize: "32px", fontWeight: 700 }}>
              D
            </span>
          </div>
          <span
            style={{
              fontSize: "48px",
              fontWeight: 700,
              color: "#2563eb",
            }}
          >
            DecaJobs
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: "56px",
            fontWeight: 700,
            color: "#111827",
            textAlign: "center",
            lineHeight: 1.2,
            margin: "0 0 16px 0",
          }}
        >
          10 Perfect Jobs, Every Morning
        </h1>

        {/* Subheadline */}
        <p
          style={{
            fontSize: "24px",
            color: "#6b7280",
            textAlign: "center",
            maxWidth: "800px",
            margin: "0 0 40px 0",
          }}
        >
          AI-powered job matching from LinkedIn, Indeed, Glassdoor & 20+ sources.
          Delivered to your inbox daily.
        </p>

        {/* Features row */}
        <div
          style={{
            display: "flex",
            gap: "32px",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#eff6ff",
              padding: "12px 20px",
              borderRadius: "9999px",
            }}
          >
            <span style={{ color: "#2563eb", fontSize: "18px", fontWeight: 600 }}>
              ✓ AI Matching
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#f0fdf4",
              padding: "12px 20px",
              borderRadius: "9999px",
            }}
          >
            <span style={{ color: "#16a34a", fontSize: "18px", fontWeight: 600 }}>
              ✓ Remote & Local
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#fef3c7",
              padding: "12px 20px",
              borderRadius: "9999px",
            }}
          >
            <span style={{ color: "#d97706", fontSize: "18px", fontWeight: 600 }}>
              ✓ Free to Start
            </span>
          </div>
        </div>

        {/* URL */}
        <p
          style={{
            position: "absolute",
            bottom: "30px",
            fontSize: "18px",
            color: "#9ca3af",
          }}
        >
          decajobs.com
        </p>
      </div>
    ),
    { ...size }
  );
}
