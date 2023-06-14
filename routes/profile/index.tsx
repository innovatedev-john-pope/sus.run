import { Handlers, PageProps } from "$fresh/server.ts";
import { AuthState } from "../../lib/auth.ts";
import { USER_URLS_PREFIX, kv } from "../../lib/data.ts";

interface Data {
  urls: string[];
}

export const handler: Handlers<Data, AuthState> = {
  GET: async (_req, ctx) => {
    const user = ctx.state.session?.user.username;
    const userUrls = await kv.list({prefix: [USER_URLS_PREFIX, user]})

    return ctx.render({ urls: userUrls.value })
  },
}

export default function (props: PageProps<Data, AuthState>) {
  return <div>{props.data.urls}</div>;
}