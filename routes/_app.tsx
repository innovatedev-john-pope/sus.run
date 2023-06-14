
import { PageProps } from "$fresh/server.ts";
import { ComponentType } from "preact";
import { SessionState } from "~/lib/auth.ts";
import { Head } from "$fresh/runtime.ts";
import SkipToContent from "~/components/SkipToContent.tsx";

export default function App({ url, Component, state }: PageProps<unknown, SessionState> & {
  Component: ComponentType<Record<never, never>>;
}) {
  return <>
    <Head>
      <title>sus.run - Safe URL shortener</title>
    </Head>
    
    <SkipToContent />

    <div class="flex flex-col min-h-screen">
      <header class="flex gap-4 justify-between p-4 max-w-screen-xl m-auto w-full items-center">
        <div class="text-4xl">
          {url.pathname !== '/' ?
            <a href="/">sus.run</a>
          :
            <span>&nbsp;</span>
          }
        </div>

        {state && <nav class="flex gap-4">
          {state.session ? 
            <>
              {state.isAdmin && <a href="/admin/clean-db">DB</a>}
              <a href="/profile">{state.session.user.username}</a>
              <a href="/signout">Sign Out</a>
            </>
          :
            <a href="/signin">Sign In</a>
          }
        </nav>}
      </header>
      <main id="main" class="max-w-screen-xl px-12 m-auto flex-grow w-full">
        <Component />
      </main>
      <footer class="max-w-screen-xl m-auto p-4 flex flex-col items-center gap-2">
        {url.pathname !== '/privacy' && <a href="/privacy">Privacy</a>}
        <div>
          &copy; {new Date().getFullYear()} {url.pathname !== '/' ? <a href="/">sus.run</a> : "sus.run"}
        </div>
      </footer>
    </div>
  </>
}