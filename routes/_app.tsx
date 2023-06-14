
import { PageProps } from "$fresh/server.ts";
import { ComponentType } from "preact";
import { AuthState } from "../lib/auth.ts";
import { Head } from "$fresh/runtime.ts";

export default function App({ Component, state }: PageProps<unknown, AuthState> & {
  Component: ComponentType<Record<never, never>>;
}) {
  return <>
    <Head>
      <title>sus.run - Safe URL shortener</title>
    </Head>
    <div class="flex flex-col min-h-screen">
      <header class="flex gap-4 justify-between p-4 max-w-screen-xl m-auto w-full">
        <a href="/">sus.run</a>

        {state && <nav class="flex gap-4">
          {state.session ? 
            <>
              {state.session.user.username}
              <a href="/signout">Sign Out</a>
            </>
          :
            <a href="/signin">Sign In</a>
          }
        </nav>}
      </header>
      <div class="max-w-screen-xl px-12 m-auto flex-grow w-full">
        <Component />
      </div>
    </div>
  </>
}