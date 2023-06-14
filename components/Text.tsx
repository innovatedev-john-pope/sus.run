import { JSX } from "preact";

interface Props extends Omit<JSX.HTMLAttributes<HTMLInputElement>, 'placeholder'> {
  label: string;
}

export function Text({label, class: className, ...props}: Props) {
  return (
    <label class="flex flex-col flex-grow relative input-has-value:(top-0 text-gray-600)">
      <div class="px-2 text-sm absolute z-10 bottom-2 ">
        {label}
      </div>

      <input
        {...props}
        placeholder={' '}
        class={`px-2 pt-5 pb-1 border-b(gray-200 4) rounded w-full ${className??''}`}
      />
    </label>
  );
}
