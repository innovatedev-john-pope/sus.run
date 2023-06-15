import { getCookies, setCookie } from "$std/http/cookie.ts"
import { COOKIE_BASE, SITE_COOKIE_NAME, getCookieName, isSecure, redirect } from "deno_kv_oauth/_core.ts"
import { AnonUser, KEY_PREFIX, User, kv } from "./data.ts"

export interface SessionState {
  sid: string|null
  accessToken: string|null
  session: OauthSession|AnonSession
  isAdmin: boolean
  isAuthed: boolean
  username?: string
}

export interface OauthSession {
  user: User
}

export interface AnonSession {
  user: AnonUser
}

export async function login(sessionId: string, user: User) {
  const userKey = [KEY_PREFIX.users, user.username];
  const fromDB = await kv.get(userKey);
  if(fromDB.value) {
    user = {...fromDB.value, ...user};
  } else {
    user.sus = 0;
    user.trust = 0;
  }

  let checkRecord = fromDB;
  if(!fromDB.value) {
    checkRecord = { key: userKey, versionstamp: null }
  }

  await kv.atomic()
    .check(checkRecord)
    .set([KEY_PREFIX.session, sessionId], {user})
    .set(userKey, user)
    .commit();
}

export async function getSessionData(sessionId: string): Promise<OauthSession|AnonSession> {
  const response = await kv.get([KEY_PREFIX.session, sessionId]);
  return response.value;
}

export async function createAnonSession(url: string) {
  const response = redirect(url);
  const sessionId = crypto.randomUUID();

  setCookie(
    response.headers,
    {
      ...COOKIE_BASE,
      name: getCookieName(SITE_COOKIE_NAME, isSecure(url)),
      value: sessionId,
      secure: isSecure(url),
    },
  );
  
  const session: AnonSession = {
    user: {
      id: crypto.randomUUID(),
      username: '<ANON>'
    }
  }
  
  await kv.set([KEY_PREFIX.session, sessionId], session);

  return response;
}

export function getSessionId(request: Request) {
  const cookieName = getCookieName(SITE_COOKIE_NAME, isSecure(request.url));
  const sessionId = getCookies(request.headers)[cookieName];
  if (sessionId === undefined) return null;
  return sessionId;
}