import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { redirect } from "deno_kv_oauth/_core.ts";
import { RouteState } from "./route.ts";

export async function AuthMiddleware(
  _req: Request,
  ctx: MiddlewareHandlerContext<RouteState>,
) {
  if(ctx.destination !== 'route') {
    return ctx.next();
  }

  const path = ctx.state.url.pathname;

  const isLoggedIn = ctx.state.isAuthed;
  let authType = ctx.state.route?.config?.auth || 'private';
  if(['/signin', '/oauth/callback/github'].includes(path)) {
    authType = 'guest';
  }

  if(['/signout'].includes(path)) {
    authType = 'private';
  }

  if(['/'].includes(path)) {
    authType = 'public';
  }

  if(!isLoggedIn && authType === 'private') {
    throw new Error('Not authorized', { cause: 'auth' });
  }

  if(isLoggedIn && authType === 'guest') {
    return redirect('/');
  }

  const resp = await ctx.next();
  return resp;
}