const isProduction =
  process.env.VERCEL_ENV === "production" ||
  process.env.NODE_ENV === "production";

export const SERVER_URL = isProduction
  ? "https://vertical.digitalent.cloud/api/dossier"
  : "https://merge.digitalent.cloud/api/dossier";
