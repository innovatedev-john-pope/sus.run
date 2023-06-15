import { Button } from "~/components/Button.tsx";
import { User } from "~/lib/data.ts";
import {useSignal} from "@preact/signals";

export default function ShortCodeUser({user}: {user: User}) {
  const userSignal = useSignal(user);

  return <div class="flex justify-between">
    <form method="post">
      <Button type="submit" name="action" value="user-sus" class="text-xl font-sus">
        {userSignal.value.sus || 0} SUS
      </Button>
    </form>

    <form method="post">
      <Button color="green" name="action" value="user-trust" class="text-xl font-sus">
        {userSignal.value.trust || 0} Trust
      </Button>
    </form>
  </div>
}