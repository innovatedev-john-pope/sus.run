import settings from "../settings.ts";

export const kv = await Deno.openKv(settings.database.path);

export const KEY_PREFIX = {
  urls: "urls",
  userUrls: "user-urls",
  urlDestinations: "url-destinations",
  session: "session",
  users: "users",
}