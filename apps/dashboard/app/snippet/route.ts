import { readFileSync } from "fs";
import { join } from "path";
import { NextResponse } from "next/server";

export const dynamic = "force-static";

export function GET() {
  try {
    const filePath = join(process.cwd(), "../snippet/dist/flowlift.min.js");
    const contents = readFileSync(filePath);
    return new NextResponse(contents, {
      headers: {
        "Content-Type": "application/javascript",
        "Cache-Control": "public, max-age=86400",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return new NextResponse("Snippet not found", { status: 404 });
  }
}
