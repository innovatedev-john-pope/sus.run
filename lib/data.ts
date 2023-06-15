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

export interface User {
  source: 'github';
  id: string;
  username: string;
  avatarUrl: string;
  sus?: number;
  subs?: number;
}

export interface SusRecord {
  code: string;
  destination: string;
  username: string;
  createdAt: Date;
  lastClickAt: Date;
  lastSusAt: Date;
  clicks: number;
  views: number;
  sus: number;
}

export async function updateShortCodeRecord(shortCode: string, stat: 'clicks' | 'sus' | 'views') {
  const recordKey = [KEY_PREFIX.urls, shortCode];
  const record = await kv.get(recordKey)
  await kv.atomic()
    .check(record)
    .set(recordKey, { ...record.value, [stat]: parseInt(record.value[stat] + 1) })
    .commit();

  return record;
}