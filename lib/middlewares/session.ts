import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { SessionState, createAnonSession, getSessionData, getSessionId } from "~/lib/auth.ts";
import settings from "~/settings.ts";

export async function SessionMiddleware(
  req: Request,
  ctx: MiddlewareHandlerContext<SessionState>,
) {
  if(ctx.destination !== 'route') {
    return ctx.next();
  }

  ctx.state.sid = getSessionId(req)
  
  if(ctx.state.sid) {
    ctx.state.session = await getSessionData(ctx.state.sid)
    
    const username = ctx.state.session?.user?.username!;
    ctx.state.username = username;

    ctx.state.isAuthed = username !== '<ANON>'
    
    ctx.state.isAdmin = settings.admin.users.indexOf(username) !== -1
  } else {
    return await createAnonSession(req.url);
  }

  const resp = await ctx.next();

  return resp;
}