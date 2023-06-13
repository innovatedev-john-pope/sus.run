import { Button } from "../components/Button.tsx";
import { Text } from "../components/Text.tsx";

export default function Home() {
  return <div class="p-4 mx-auto pt-[30%]">
    <form action="" method="post" class="flex justify-center gap-2 items-end max-w-xl m-auto">
      <Text label="URL" name="url" type="url" required />
      <Button type="submit">Shorten</Button>
    </form>
  </div>
}
