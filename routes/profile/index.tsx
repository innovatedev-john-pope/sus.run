import { Handlers, PageProps } from "$fresh/server.ts";
import DeleteShortCode from "../../islands/DeleteShortCode.tsx";
import { SessionState } from "../../lib/auth.ts";
import { KEY_PREFIX, kv } from "../../lib/data.ts";

interface Data {
  urls: { shortCode: string, destination: string, url: string }[];
}

export const handler: Handlers<Data, SessionState> = {
  GET: async (req, ctx) => {
    const url = new URL(req.url);
    const user = ctx.state.session?.user.username;

    const userUrls = []
    const userUrlsIterator = await kv.list({prefix: [KEY_PREFIX.userUrls, user]})

    for await (const record of userUrlsIterator) {
      userUrls.push({shortCode: record.key[2], destination: record.value, url: `${url.origin}/${record.key[2]}`});
    }

    return ctx.render({ urls: userUrls })
  },
  DELETE: async (req, ctx) => {
    const data = await req.json();
    const username = ctx.state.username;

    const fromDb = await kv.get([KEY_PREFIX.userUrls, username, data.shortCode]);

    if (!fromDb) {
      return new Response(null, {status: 404});
    }

    const success = await kv.atomic()
      .check(fromDb)
      .delete([KEY_PREFIX.userUrls, username, data.shortCode])
      .delete([KEY_PREFIX.urls, data.shortCode])
      .delete([KEY_PREFIX.urlDestinations, fromDb.value, data.shortCode])
      .commit();

    return new Response(null, {status: 204});
  }
}

export default function (props: PageProps<Data, SessionState>) {
  return <>
    {props.data.urls.length === 0 && <div class="text-center text-gray-600 bg-yellow-100 rounded border(yellow-300 2) p-4 mt-[30%]">No URLs</div>}

    <div class="grid grid-cols-7 my-8 gap-8 mx-auto">
      {props.data.urls.map(url => <>
        <a href={url.url} class="text-gray-600">{url.shortCode}</a>
        <a href={url.destination} class="col-span-5">
          {url.destination}
        </a>
        <DeleteShortCode code={url.shortCode} />
      </>)}
    </div>
  </>
}