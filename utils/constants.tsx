const vercelEnv = process.env.VERCEL_ENV || process.env.NEXT_PUBLIC_VERCEL_ENV;
// On Vercel, NODE_ENV is always "production". Use VERCEL_ENV to distinguish preview vs production.
const isProduction = vercelEnv
  ? vercelEnv === "production"
  : process.env.NODE_ENV === "production";

export const SERVER_URL = isProduction
  ? "https://vertical.digitalent.cloud/api/dossier"
  : "https://merge.digitalent.cloud/api/dossier";
