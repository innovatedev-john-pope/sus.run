import { Handler } from "$fresh/server.ts";
import { AuthState } from "../../../lib/auth.ts";
import { URLS_PREFIX, URL_DESTINATIONS_PREFIX, USER_URLS_PREFIX, kv } from "../../../lib/data.ts";
import settings from "../../../settings.ts";

export const handler: Handler<unknown, AuthState> = async (req, ctx) => {
  const user = ctx.state.session?.user.username;

  if(!user || settings.admin.users.indexOf(user) === -1) {
    return new Response("You are not allowed to do this", { status: 403 });
  }

  const url = new URL(req.url);
  const confirmed = url.searchParams.get("confirm") === "true";

  if(!confirmed) {
    return new Response("You must confirm the action", { status: 400 });
  }

  const records: Record<string, unknown[]> = {};
  for(const prefix of [URLS_PREFIX, URL_DESTINATIONS_PREFIX, USER_URLS_PREFIX]) {
    const iterator = await kv.list({prefix: [prefix]})

    console.log(iterator)
    for await (const res of iterator) {
      await kv.delete(res.key);
      
      if(!records[prefix]) records[prefix] = [];

      records[prefix].push(res);
    }
  }

  return new Response(JSON.stringify(records, null, 2), { status: 200 });
}