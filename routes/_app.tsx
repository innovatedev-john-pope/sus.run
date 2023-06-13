
import { PageProps } from "$fresh/server.ts";
import { ComponentType } from "preact";
import { AuthState } from "../lib/auth.ts";

export default function App({ Component, state }: PageProps<unknown, AuthState> & {
  Component: ComponentType<Record<never, never>>;
}) {
  return (
    <div class="wrapper">
      <header class="flex gap-4 justify-between p-4">
        <a href="/">sus.run</a>

        <nav class="flex gap-4">
          {state.session ? 
            <>
              {state.session.user.username}
              <a href="/signout">Sign Out</a>
            </>
          :
            <a href="/signin">Sign In</a>
          }
        </nav>
      </header>
      <Component />
    </div>
  );
}