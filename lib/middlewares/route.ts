import { Handler, Handlers, MiddlewareHandlerContext } from "$fresh/server.ts";
import { SessionState } from "../auth.ts";
import router from "~/fresh.gen.ts";
import { FunctionComponent } from "preact";

export interface Route { default?: FunctionComponent, handler?: Handler|Handlers, config?: { routeOverride?: string, auth?: 'public'|'guest' } }
export interface RouteState extends SessionState {
  route: Route|null
  url: URL
}

export async function RouteMiddleware(
  req: Request,
  ctx: MiddlewareHandlerContext<RouteState>,
) {
  if(ctx.destination !== 'route') {
    return ctx.next();
  }

  ctx.state.url = new URL(req.url);
  ctx.state.route = getRoute(ctx.state.url.pathname);

  return await ctx.next();
}

export function getRoute(path: string) {
  const routes = router.routes;

  if (path === "/") return routes["./routes/index.tsx"] as unknown as Route;

  const route = Object.entries(routes).find(([r, m]) => {
    return r.replace("./routes", "").startsWith(path);
  });
  let match = route?.at(1);

  if (!match) {
    //match to /[params]/that/[could]/be/anything
    const route = Object.entries(routes).find(([r, m]) => {
      const routeParts = r.replace("./routes", "").replace(/.tsx?$/, "").split(
        "/",
      );
      const pathParts = path.split("/");
      if (routeParts.length !== pathParts.length) return false;
      for (let i = 0; i < routeParts.length; i++) {
        if (routeParts[i].startsWith("[") && routeParts[i].endsWith("]")) {
          continue;
        }
        if (routeParts[i] !== pathParts[i]) return false;
      }
      return true;
    });
    match = route?.at(1);
  }

  //TODO: fix for config.routeOverride
  // if(!match) {
  //   console.log('no match for', path, 'in', routes);
  // }

  return (match as Route)||null;
}