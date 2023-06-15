
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

      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={'true'}/>
      <link href="https://fonts.googleapis.com/css2?family=Changa+One&family=VT323&display=swap" rel="stylesheet"/>
    </Head>
    
    <SkipToContent />

    <div class="flex flex-col min-h-screen">
      <header class="flex gap-4 justify-between p-4 max-w-screen-xl m-auto w-full items-center">
        <div class="text-4xl">
          {url.pathname !== '/' ?
            <div class="flex flex-col items-center">
            <a href="/" class="site-title">sus.run</a>
            <div class="text-sm">Safe URL Shortener</div>
            </div>
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
      <footer class="max-w-screen-xl mx-auto mt-8 p-4 grid grid-cols-3 items-end w-full">
        <a href="https://fresh.deno.dev">
          <img
            width="197"
            height="37"
            src="https://fresh.deno.dev/fresh-badge.svg"
            alt="Made with Fresh"
          />
        </a>
        
        <div class="flex flex-col items-center gap-2">
          {url.pathname !== '/privacy' && <a href="/privacy">Privacy</a>}
        </div>

        <a href="https://github.com/innovatedev-john-pope/sus.run" class="flex gap-2 items-center justify-end">
          <svg height="32" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="32" data-view-component="true" class="octicon octicon-mark-github v-align-middle">
              <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
          </svg>
          Source
        </a>
      </footer>
    </div>
  </>
}