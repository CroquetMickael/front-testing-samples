// Browser-safe: usable from every sample (Node, jsdom, browser, E2E). Microcks always listens on this fixed port.
export const MICROCKS_PORT = 8585;
export const MICROCKS_URL = `http://localhost:${MICROCKS_PORT}`;

/** Base URL of a REST mock, named after the OpenAPI `info.title` / `info.version` of its artifact. */
export function microcksRestUrl(service: string, version: string): string {
  return `${MICROCKS_URL}/rest/${encodeURIComponent(service)}/${encodeURIComponent(version)}`;
}
