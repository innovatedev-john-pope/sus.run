import { Handlers } from "$fresh/server.ts";
import { Button } from "../components/Button.tsx";
import { Text } from "../components/Text.tsx";
import { AuthState } from "../lib/auth.ts";
import { handler as ApiHandler } from "./api/shorten.ts";

export const handler: Handlers<unknown, AuthState> = {
  GET: (_req, ctx) => ctx.render(),
  POST: ApiHandler.POST,
}

export default function Home() {
  return <div class="p-4 mx-auto pt-[30%]">
    <form action="" method="post" class="flex justify-center gap-2 items-end max-w-xl m-auto">
      <Text label="URL" name="url" type="url" required />
      <Button type="submit">Shorten</Button>
    </form>
  </div>
}
