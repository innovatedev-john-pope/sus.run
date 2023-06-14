import { MiddlewareHandler } from "$fresh/server.ts";

export const handler: MiddlewareHandler = async (req, ctx) => {
  if(!ctx.state.isAdmin) {
    return new Response("Unauthorized", { status: 403 })
  }
  return await ctx.next();
}