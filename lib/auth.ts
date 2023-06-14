import { KEY_PREFIX, kv } from "./data.ts"

export interface AuthState {
  sid: string|null
  accessToken: string|null
  session: OauthSession|null
  isAdmin: boolean
  username: string
}

export interface OauthSession {
    user: User
}

export interface User {
  username: string
  id: string
  avatar_url: string
}


export async function login(sessionId: string, user: User) {
  await kv.set([KEY_PREFIX.session, sessionId], {user});
  await kv.set(["users", user.id], user);
}

export async function getSessionData(sessionId: string): Promise<OauthSession|null> {
  const response = await kv.get([KEY_PREFIX.session, sessionId]);
  return response.value;
}