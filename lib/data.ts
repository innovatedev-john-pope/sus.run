import { getSessionId } from "https://deno.land/x/deno_kv_oauth@v0.2.0-beta/mod.ts";
import settings from "../settings.ts";

export const kv = await Deno.openKv(settings.database.path);

getSessionId

export const KEY_PREFIX = {
  urls: "urls",
  userUrls: "user-urls",
  urlDestinations: "url-destinations",
  session: "session",
  users: "users",

  // from deno_kv_oauth
  oauthSessions: "oauth_sessions",
  storedTokensBySession: "stored_tokens_by_session",
}