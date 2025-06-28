import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default withSentryConfig(nextConfig, {
  disableLogger: true,
  org: "",
  project: "",
  silent: !process.env.CI,
  widenClientFileUpload: true,
});
