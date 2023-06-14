import { AuthMiddleware } from "../lib/middlewares/auth.ts";
import { RouteMiddleware } from "../lib/middlewares/route.ts";
import { SessionMiddleware } from "../lib/middlewares/session.ts";

export const handler = [
  SessionMiddleware,
  RouteMiddleware,
  AuthMiddleware,
]