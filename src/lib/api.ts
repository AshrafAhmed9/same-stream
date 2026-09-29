/**
 * The Worker (D1 + ENORA proxy) is deployed separately from the Pages
 * static site, so we call it by absolute URL. The Worker sets
 * Access-Control-Allow-Origin: * (see worker/index.ts), so this works
 * cross-origin from any Pages domain.
 */
export const API_BASE = "https://same-stream.ashrafahmed1232.workers.dev";
