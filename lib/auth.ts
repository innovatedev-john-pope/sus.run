import { kv } from "./data.ts"

export interface AuthState {
  sid: string|null
  accessToken: string|null
  session: OauthSession|null
}

export interface OauthSession {
    user: User
}

export interface User {
  username: string
  id: string
  avatar_url: string
}


const SESSION_PREFIX = "session";

export async function login(sessionId: string, user: User) {
  await kv.set([SESSION_PREFIX, sessionId], JSON.stringify({user}));
  await kv.set(["users", user.id], JSON.stringify(user));
}

export async function getSessionData(sessionId: string): Promise<OauthSession|null> {
  const response = await kv.get([SESSION_PREFIX, sessionId]);
  const session = response.value ? JSON.parse(response.value) as OauthSession : null;

  return session;
}