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
  actions: "actions",

  // from deno_kv_oauth
  oauthSessions: "oauth_sessions",
  storedTokensBySession: "stored_tokens_by_session",
}

export interface Actions {
  shortCodes: {
    [shortCode: string]: {
      views: boolean;
      clicks: boolean;
      sus: boolean;
    }
  },
  users: {
    [username: string]: {
      sus: boolean;
      trust: boolean;
    }
  }
}

export interface User {
  source: 'github';
  id: string;
  username: string;
  avatarUrl: string;
  sus?: number;
  trust?: number;
}

export interface AnonUser {
  username: '<ANON>'
  id: string;
}

export type UserOrAnon = User | AnonUser;

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

export async function updateShortCodeRecord(userId: string, shortCode: string, stat: 'clicks' | 'sus' | 'views') {
  const actions = await getActions(userId);
  const recordKey = [KEY_PREFIX.urls, shortCode];
  const record = await kv.get(recordKey)

  if(!record.value) {
    return null
  }

  const didAction = actions.value?.shortCodes[shortCode]?.[stat];
  let dir = 1;

  switch(stat) {
    case 'clicks': if(didAction) return record; break; // don't track click again
    case 'views': if(didAction) return record; break; // don't track view again
    case 'sus':
      if(didAction) {
        dir = -1; // if already sus, unsus
      }
  }

  const actionsValue = actions.value || {
    shortCodes: {},
    users: {},
  };

  if(!actionsValue.shortCodes[shortCode]) {
    actionsValue.shortCodes[shortCode] = {
      clicks: false,
      views: false,
      sus: false,
    }
  }
  actionsValue.shortCodes[shortCode][stat] = !didAction;

  let actionCheck = actions;
  if(!actionCheck.versionstamp) {
    actionCheck = {
      key: actions.key,
      versionstamp: null,
    }
  }

  await kv.atomic()
    .check(actionCheck)
    .check(record)
    .set(recordKey, { ...record.value, [stat]: parseInt(record.value[stat] + dir) })
    .set(actions.key, actionsValue)
    .commit();

  return record;
}

export async function udpateShortCodeUserRecord(shortCode: string, stat: 'sus' | 'trust') {
  const record = await kv.get([KEY_PREFIX.urls, shortCode])
  
  const userKey = [KEY_PREFIX.users, record.value.username];
  const user = await kv.get(userKey);

  await kv.atomic()
    .check(user)
    .set(userKey, { ...user.value, [stat]: (user.value[stat] || 0) + 1 })
    .commit();

  return {user, record};
}

export async function getActions(userId: string): Promise<{key: string[], value?: Actions, versionstamp: string|null}> {
  const actionsRecord = await kv.get([KEY_PREFIX.actions, userId]);

  if(!actionsRecord.value) {
    return {
      key: [KEY_PREFIX.actions, userId],
      value:{
        shortCodes: {},
        users: {},
      },
      versionstamp: null,
    }
  }

  return actionsRecord;
}