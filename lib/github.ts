import { User } from "./data.ts"

const baseUrl = 'https://api.github.com'
export async function githubUser(token: string) {
  const response = await fetch(`${baseUrl}/user`, {
    headers: {
      Authorization: `token ${token}`
    }
  })

  const {login: username, id, avatar_url: avatarUrl} = await response.json()
  return {source: 'github', id, username, avatarUrl} as User;
}