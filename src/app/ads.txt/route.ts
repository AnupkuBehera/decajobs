import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = 86400; // Revalidate daily

export async function GET() {
  const pubId =
    process.env.NEXT_PUBLIC_ADSENSE_PUB_ID || "pub-7950314044956492";
  const formattedPubId = pubId.startsWith("pub-") ? pubId : `pub-${pubId}`;
  const content = `google.com, ${formattedPubId}, DIRECT, f08c47fec0942fa0\n`;

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control":
        "public, max-age=86400, s-maxage=86400, stale-while-revalidate",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
