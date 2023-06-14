export default {
  database: {
    path: Deno.env.get("DATABASE_PATH")||null,
  },
  github: {
    clientId: Deno.env.get("GITHUB_CLIENT_ID")!,
    clientSecret: Deno.env.get("GITHUB_CLIENT_SECRET")!,
  },
  admin: {
    users: Deno.env.get("ADMIN_USERS")!.split(","),
  },
}