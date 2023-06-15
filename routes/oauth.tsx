import {
  createGitHubOAuth2Client,
  handleCallback,
  signIn,
  signOut,
} from "deno_kv_oauth";
import { Handlers } from "$fresh/server.ts";
import { githubUser } from "../lib/github.ts";
import { login } from "../lib/auth.ts";

export const handler: Handlers = {
  GET: async (request, ctx) => {
    const oauth2Client = createGitHubOAuth2Client();
    const { pathname } = new URL(request.url);

    switch (pathname) {
      case "/signin": {
        return await signIn(request, oauth2Client);
      }
      case "/oauth/callback/github": {
        const { response, accessToken, sessionId } = await handleCallback(request, oauth2Client);
        const ghUser = await githubUser(accessToken);

        login(sessionId, ghUser);

        return response;
      }
      case "/signout": {
        return await signOut(request);
      }
      default: {
        return ctx.renderNotFound();
      }
    }
  }
}

export const config = {
  routeOverride: "/(signin|oauth/callback/github|signout)",
}