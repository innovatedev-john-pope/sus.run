import { SessionMiddleware } from "../lib/middlewares/session.ts";

export const handler = [
  SessionMiddleware,
]