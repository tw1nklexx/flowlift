import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tell Next.js the monorepo root so Vercel's file tracer can reach ../snippet/
  outputFileTracingRoot: path.join(__dirname, "../../"),
  outputFileTracingIncludes: {
    "/snippet": ["../../apps/snippet/dist/flowlift.min.js"],
  },
};

export default nextConfig;
