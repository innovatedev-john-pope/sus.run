import { Handlers } from "$fresh/server.ts";
import { AuthState } from "../../lib/auth.ts";
import { kv } from "../../lib/data.ts";

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
      const fromDb = await kv.get(["urls", shortCode])
      inUse = fromDb.value ? true : false;
    } while (inUse && attempts++ < 20);

    if(inUse) {
      return new Response("Failed to generate a short code", { status: 500 });
    }

    const user = ctx.state.session?.user.username || "<ANON>";
    
    const success = await kv.atomic()
      .set(["urls", shortCode], {user, destination})
      .set(["user-urls", user], {shortCode, destination})
      .set(["url-destinations", destination], {user, shortCode})
      .commit();

    if(!success) {
      return new Response("Failed to save the url", { status: 500 });
    }

    return new Response(url.origin + "/" + shortCode, { status: 200 })
  },
  GET: async (req, ctx) => {
    const url = new URL(req.url);
    const shortCode = url.pathname.substring(1);
    const fromDb = await kv.get(["urls", shortCode]);

    if(!fromDb.value) {
      return new Response("Not found", { status: 404 });
    }

    return new Response(fromDb.value.destination, { status: 200 })
  }
}