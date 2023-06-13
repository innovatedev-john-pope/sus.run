import { PageProps } from "$fresh/server.ts";
import { handler as ApiHandler } from "./api/shorten.ts";

export const handler = ApiHandler.GET

export default function Greet(props: PageProps) {
  return <div>{props.params.code}</div>;
}
