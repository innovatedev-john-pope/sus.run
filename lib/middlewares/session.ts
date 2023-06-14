import { MiddlewareHandlerContext } from "$fresh/server.ts";
import {
  getSessionId
} from "deno_kv_oauth";
import { AuthState, getSessionData } from "../auth.ts";
import settings from "../../settings.ts";

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
    
    const user = ctx.state.session?.user.username!;
    ctx.state.username = user
    
    ctx.state.isAdmin = settings.admin.users.indexOf(user) !== -1
  }

  const resp = await ctx.next();

  return resp;
}