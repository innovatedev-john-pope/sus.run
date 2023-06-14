import { ErrorHandler, ErrorPageProps } from "$fresh/server.ts";

export const handler: ErrorHandler = async (req, ctx) => {
  const resp = await ctx.render();
  
  return new Response(resp.body, { status: 404, statusText: resp.statusText, headers: resp.headers })
}

export default function ErrorRoute(props: ErrorPageProps ) {
  return <div>500</div>;
}