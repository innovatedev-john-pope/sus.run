import { MiddlewareHandlerContext } from "$fresh/server.ts";
import {
  getSessionId
} from "deno_kv_oauth";
import { AuthState, getSessionData } from "../auth.ts";

export async function SessionMiddleware(
  req: Request,
  ctx: MiddlewareHandlerContext<AuthState>,
) {
  if(ctx.destination !== 'route') {
    return ctx.next();
  }

  ctx.state.sid = await getSessionId(req)

  if(ctx.state.sid) {
    ctx.state.session = await getSessionData(ctx.state.sid)
  }

  const resp = await ctx.next();

  return resp;
}