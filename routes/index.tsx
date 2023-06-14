import { Handlers } from "$fresh/server.ts";
import { Button } from "../components/Button.tsx";
import { Text } from "../components/Text.tsx";
import { SessionState } from "../lib/auth.ts";
import { handler as ApiHandler } from "./api/shorten.ts";

export const handler: Handlers<unknown, SessionState> = {
  GET: (_req, ctx) => ctx.render(),
  POST: ApiHandler.POST,
}

export default function Home() {
  return <div class="flex flex-col gap-16 p-4 mx-auto pt-[15%]">
    <div class="text-center">
      <div class="text-6xl text-center mb-2">
        sus.run
      </div>
      <div class="text-md">
        The Safe URL Shortener
      </div>
    </div>

    <form action="" method="post" class="flex justify-center gap-2 items-end max-w-xl m-auto">
      <Text label="URL" name="url" type="url" required />
      <Button type="submit">Shorten</Button>
    </form>
  </div>
}
