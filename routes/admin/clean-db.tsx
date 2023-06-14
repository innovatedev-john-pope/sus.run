import { Handler, PageProps } from "$fresh/server.ts";
import { SessionState } from "~/lib/auth.ts";
import { KEY_PREFIX, kv } from "~/lib/data.ts";
import { Button } from "../../components/Button.tsx";
import { redirect } from "https://deno.land/x/deno_kv_oauth@v0.2.0-beta/src/_core.ts";

type KVRecord = Record<string, {key: string[], value: unknown}[]>
interface Data {records: KVRecord, isDelete: boolean}

export const handler: Handler<Data, SessionState> = async (req, ctx) => {
  const url = new URL(req.url);
  const isDelete = url.searchParams.has("delete")
  const deleteConfirmed = url.searchParams.get("confirm") === "true";

  const records: KVRecord = {};
  for(const prefix of Object.values(KEY_PREFIX)) {
    const iterator = await kv.list({prefix: [prefix]})

    for await (const res of iterator) {
      if(deleteConfirmed) {
        await kv.delete(res.key);
      }

      // sanitaze any fields that have potentially sensitive info in the name
      for(const key in res.value) {
        if(key.search(/token|password/i) > -1) {
          res.value[key] = "<redacted>";
        }
      }

      
      if(!records[prefix]) records[prefix] = [];

      records[prefix].push(res);
    }
  }

  if(deleteConfirmed) {
    return redirect('/')
  }

  return ctx.render({records, isDelete});
}

export default function({data: {records, isDelete}}: PageProps<Data>) {
  return <>
    <div class="flex justify-end mb-4">
      {isDelete ? 
        <Button href="?delete&confirm=true">Confirm Delete</Button>
      :
        <Button href="?delete">Delete All Data</Button>
      }
    </div>
    {Object.entries(records).map(([prefix, records]) => <div class="flex flex-col gap-2 mb-8 border rounded p-4">
      <h2 class="text-2xl">{prefix}</h2>
      {records.map((record, i) => <div class={`p-4 grid grid-cols-2 w-full truncate hover:(bg-gray-300)
        ${i % 2 === 0 ? "bg-gray-200" : ""}
      `}>
        <div>
          {record.key.map(key => <div class="text-lg max-w-32 text-ellipsis">{key}</div>)}
        </div>
        <pre class=""><code>{JSON.stringify(record.value, null, 2)}</code></pre>
      </div>)}
    </div>)}
  </>
}