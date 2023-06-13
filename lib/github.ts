const baseUrl = 'https://api.github.com'
export async function githubUser(token: string) {
  const response = await fetch(`${baseUrl}/user`, {
    headers: {
      Authorization: `token ${token}`
    }
  })

  return await response.json()
}