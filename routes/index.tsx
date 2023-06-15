import { Handlers, PageProps } from "$fresh/server.ts";
import { redirect } from "deno_kv_oauth/_core.ts";
import { Button } from "../components/Button.tsx";
import { Text } from "../components/Text.tsx";
import { SessionState } from "../lib/auth.ts";
import { KEY_PREFIX, kv } from "../lib/data.ts";

interface Data {
  error?: string;
  destination?: string;
}

export const handler: Handlers<Data, SessionState> = {
  GET: (_req, ctx) => ctx.render(),
  POST: async (req, ctx) => {
    const url = new URL(req.url);
    const data = await req.formData();
    const destination = data.get("destination") as string || undefined;

    if(!destination) {
      return ctx.render({ error: "No URL provided" });
    }

    let inUse = true;
    let shortCode = "";
    let attempts = 0;
    do {
      shortCode = Math.random().toString(36).substring(2, 7);
      const fromDb = await kv.get([KEY_PREFIX.urls, shortCode])
      inUse = fromDb.value ? true : false;
    } while (inUse && attempts++ < 20);

    if(inUse) {
      return ctx.render({ destination, error: "Failed to generate a short code. Please try again later." });
    }

    const success = createShortcode(shortCode, destination, ctx.state.username);

    if(!success) {
      return ctx.render({ destination, error: "Failed to generate a short code. Please try again later." });
    }

    return redirect(`/${shortCode}`);
  },
}

export default function Home({ data, ...props }: PageProps<Data>) {
  return <div class="flex flex-col gap-16 p-4 mx-auto pt-[15%]">
    <div class="text-center">
      <h1 class="text-6xl mb-0 mx-auto text-center site-title">
        sus.run
      </h1>
      <div class="text-md">
        Safe URL Shortener
      </div>
    </div>

    {data?.error && <div class="p-4 bg-red-100 text-red-800 border(red-800 2) rounded max-w-lg m-auto">
      {data.error}
    </div>}

    <form action="" method="post" class="flex w-full justify-center gap-2 items-end max-w-xl m-auto">
      <Text label="URL" name="destination" type="url" value={data?.destination} required />
      <Button type="submit">Shorten</Button>
    </form>
  </div>
}

async function createShortcode(shortCode: string, destination: string, username: string) {
  username = username || "<ANON>";
    
  const urlsKey = [KEY_PREFIX.urls, shortCode];
  const userUrlsKey = [KEY_PREFIX.userUrls, username, shortCode];
  const urlDestinationsKey = [KEY_PREFIX.urlDestinations, destination, shortCode];

  const success = await kv.atomic()
    .check({ key: urlsKey, versionstamp: null })
    .check({ key: userUrlsKey, versionstamp: null })
    .check({ key: urlDestinationsKey, versionstamp: null })
    .set(urlsKey, {username, destination, sus:0, clicks: 0, views: 0 })
    .set(userUrlsKey, destination)
    .set(urlDestinationsKey, username)
    .commit();

  return success;
}
