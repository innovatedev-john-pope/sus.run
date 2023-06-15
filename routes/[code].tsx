import { PageProps } from "$fresh/server.ts";

import { Handlers } from "$fresh/server.ts";
import { redirect } from "https://deno.land/x/deno_kv_oauth@v0.2.0-beta/src/_core.ts";
import { SessionState } from "~/lib/auth.ts";
import { Actions, KEY_PREFIX, SusRecord, User, UserOrAnon, getActions, kv, udpateShortCodeUserRecord, updateShortCodeRecord } from "~/lib/data.ts";
import { Button } from "../components/Button.tsx";
import { Alert } from "../components/Alert.tsx";
import ShortCodeUser from "../islands/ShortCodeUser.tsx";

interface Data {
  shortCode: string
  record: SusRecord
  user: UserOrAnon
  actions: Actions
}

export const handler: Handlers<Data, SessionState> = {
  POST: async (req, ctx) => {
    const shortCode = ctx.params.code;
    const data = await req.formData();
    const action = data.get("action") as string || undefined;

    if(!action) {
      return ctx.renderNotFound();
    }

    const userId = ctx.state.session.user.id;

    switch(action) {
      case "click": {
        const shortCodeRecord = await updateShortCodeRecord(userId, shortCode, 'clicks');
        const url = new URL(shortCodeRecord.value.destination);
        return redirect(url.href);
      }
      case "sus": {
        await updateShortCodeRecord(userId, shortCode, 'sus');
        return redirect(`/${shortCode}`);
      }
      case "user-sus": {
        const data = await udpateShortCodeUserRecord(shortCode, 'sus');
        return redirect(`/${shortCode}`);
      }
      case "user-trust": {
        const data = await udpateShortCodeUserRecord(shortCode, 'trust');
        return redirect(`/${shortCode}`);
      }
    }

    return ctx.renderNotFound();
  },
    
  GET: async (req, ctx) => {
    const shortCode = ctx.params.code;
    const userId = ctx.state.session.user.id;

    const shortCodeRecord = await updateShortCodeRecord(userId, shortCode, 'views');

    if(!shortCodeRecord || !shortCodeRecord.value) {
      return ctx.renderNotFound();
    }

    let userRecord: {value: UserOrAnon} = { value: {
      username: '<ANON>',
      id: '',
    }};

    if(shortCodeRecord.value.username !== '<ANON>') {
      userRecord = await kv.get([KEY_PREFIX.users, shortCodeRecord.value.username]);
    }

    const actions = await getActions(userId)

    return ctx.render({
      actions: actions.value!,
      shortCode: shortCode,
      record: shortCodeRecord.value as SusRecord,
      user: userRecord.value as UserOrAnon,
    })
  }
}

export default function Greet({data: {shortCode, actions, record, user}, ...props}: PageProps<Data>) {
  const url = new URL(record.destination);
  const { pathname, origin, username, password, searchParams } = url;

  const didReportSus = actions.shortCodes[shortCode]?.sus || false;

  return <div class="flex flex-col gap-16 p-4 mx-auto pt-16">
  <div class="text-center">
    <h1 class="text-6xl mb-0 mx-auto text-center site-title">
      {origin}
    </h1>
    {pathname !== '/' && <div class="text-4xl my-4">
      {pathname}
    </div>}

    <div class="font-sus text-4xl flex gap-8 justify-center my-4">
      <div class="text-center">
        {record.views} views
      </div>
      <div class="text-center">
        {record.clicks} clicks
      </div>
      <div class="text-center">
        {record.sus} sus
      </div>
    </div>

    {record.sus > 0 && record.sus/(record.clicks||1) > 1 && <Alert type="danger">
      This link is highly SUS... Proceed with caution!
    </Alert>}
    
    <div class="flex justify-center gap-8 my-16">
      <form method="post" class="">
        <Button type="submit" name="action" value="sus" color={didReportSus?'gray':'red'} class="px-8 py-4 font-sus text-4xl">
          {didReportSus ? 'Remove SUS' : 'Report as SUS'}
        </Button>
      </form>

      <form method="post">
        <Button color="green" name="action" value="click" class="px-8 py-4 font-sus text-4xl">
          Go!
        </Button>
      </form>
    </div>

    <div class="flex flex-col my-4">
      Original URL:
      <code><HighlightUnicode str={record.destination} /></code>
    </div>

    {user && <div class="flex justify-center text-left my-8">
      <div class="border rounded p-4 ">
        Link submitted by:
        <div>
          {user.username != '<ANON>' ?
            <a href={`https://github.com/${user.username}`} class="flex justify-center items-center gap-2">
              {<img src={(user as User).avatarUrl} alt="" class="w-8 h-8" />}
              {user.username}
            </a>
          :
            user.username
          }
        </div>

        {user.username != '<ANON>' && <div class="mt-4">
          <ShortCodeUser user={user as User} />
        </div>}

      </div>
    </div>}
  </div>

  <div>
    {url.search.length > 0 && <div class="text-left text-md my-4 p-4 border rounded">
      <h2 class="text-xl">
        Search Params:
      </h2>
      <div class="justify-center grid grid-cols-4 gap-8">
        {[...searchParams.entries()].map(([param, value]) => <div class="flex gap-4">
          <strong>{param}</strong>
          {value}
        </div>)}
      </div>
    </div>}

    {(username || password) && <div class="text-left text-md my-4 p-4 border rounded">
      <h2 class="text-xl">
        Auth:
      </h2>
      <div class="justify-center grid grid-cols-4 gap-8">
        {username && <div class="flex gap-4">
          <strong>username</strong>
          {username}
        </div>}
        {password && <div class="flex gap-4">
          <strong>password</strong>
          {password}
        </div>}
      </div>
    </div>}
  </div>
</div>;
}

export const config = {
  auth: "public",
}

// function highlightUnicode(str: string) {
//   return str.replace(/[\u{80}-\u{10FFFF}]/gu, match => `<span class="text-yellow-300">${match}</span>`);
// }

function HighlightUnicode({str}: {str: string}) {
  const unicodeChunkedStrings = splitEveryUnicode(str);
  return <>
    {unicodeChunkedStrings.map(char => {
      if(char.match(/[\u{80}-\u{10FFFF}]/gu)) {
        return <span class="bg-yellow-300">{char}</span>;
      } else {
        return char;
      }
    })}
    {unicodeChunkedStrings.length > 1 && <Alert type="warning">
      This URL contains unicode characters. If this is not expected be careful when using it!
    </Alert>}
  </>
}

// split a string, into an array of strings where each item is either a sequence of unicode
// characters or non-unicode characters
function splitEveryUnicode(str: string) {
  const re = new RegExp(`[\u{80}-\u{10FFFF}]+`, 'gu');
  const matches = str.match(re) || [];
  const split = str.split(re);
  const result = [];
  for(let i = 0; i < split.length; i++) {
    result.push(split[i]);
    if(i < matches.length) {
      result.push(matches[i]);
    }
  }
  return result;
}