import { useSignal } from "@preact/signals";

export default function ShortCode({link}: {link: string}) {
  const didCopy = useSignal(false);

  return <div class="flex flex-col items-center mb-8">
    <div class={`border p-4 rounded-lg relative ${didCopy.value ? 'bg-green-200' : 'bg-gray-200'}`}>
      <div class="text-4xl pb-2">
        {link}
      </div>
      <div class="text-xs absolute bottom-0 right-0 p-1" onClick={() =>{
        navigator.clipboard.writeText(link);
        didCopy.value = true;
      }}>
        {didCopy.value ? 'Link copied' : 'Copy link'}
      </div>
    </div>
  </div>
}