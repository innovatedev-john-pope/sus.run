import { Handlers } from "$fresh/server.ts";
import { AuthState } from "../../lib/auth.ts";
import { URLS_PREFIX, URL_DESTINATIONS_PREFIX, USER_URLS_PREFIX, kv } from "../../lib/data.ts";

export const handler: Handlers<unknown, AuthState> = {
  POST: async (req, ctx) => {
    const url = new URL(req.url);
    const data = await req.formData();
    const destination = data.get("url");

    if(!url) {
      return new Response("No url provided", { status: 400 });
    }

    let inUse = true;
    let shortCode = "";
    let attempts = 0;
    do {
      shortCode = Math.random().toString(36).substring(2, 7);
      const fromDb = await kv.get([URLS_PREFIX, shortCode])
      inUse = fromDb.value ? true : false;
    } while (inUse && attempts++ < 20);

    if(inUse) {
      return new Response("Failed to generate a short code", { status: 500 });
    }

    const user = ctx.state.session?.user.username || "<ANON>";
    
    const urlsKey = [URLS_PREFIX, shortCode];
    const userUrlsKey = [USER_URLS_PREFIX, user, shortCode];
    const urlDestinationsKey = [URL_DESTINATIONS_PREFIX, destination, shortCode];

    const success = await kv.atomic()
      .check({ key: urlsKey, versionstamp: null })
      .check({ key: userUrlsKey, versionstamp: null })
      .check({ key: urlDestinationsKey, versionstamp: null })
      .set(urlsKey, {user, destination})
      .set(userUrlsKey, destination)
      .set(urlDestinationsKey, user)
      .commit();

    if(!success) {
      return new Response("Failed to save the url", { status: 500 });
    }

    return new Response(url.origin + "/" + shortCode, { status: 200 })
  },
  GET: async (req, ctx) => {
    const url = new URL(req.url);
    const shortCode = url.pathname.substring(1);
    const fromDb = await kv.get([URLS_PREFIX, shortCode]);

    if(!fromDb.value) {
      return new Response("Not found", { status: 404 });
    }

    return new Response(fromDb.value.destination, { status: 200 })
  }
}