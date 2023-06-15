import { KEY_PREFIX, User, kv } from "./data.ts"

export interface SessionState {
  sid: string|null
  accessToken: string|null
  session: OauthSession|null
  isAdmin: boolean
  username: string
}

export interface OauthSession {
    user: User
}

export async function login(sessionId: string, user: User) {
  const userKey = [KEY_PREFIX.users, user.username];
  const fromDB = await kv.get(userKey);
  if(fromDB.value) {
    user = {...fromDB.value, ...user};
  } else {
    user.sus = 0;
    user.subs = 0;
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

export async function getSessionData(sessionId: string): Promise<OauthSession|null> {
  const response = await kv.get([KEY_PREFIX.session, sessionId]);
  return response.value;
}