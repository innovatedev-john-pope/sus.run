import { JSX } from "preact";

interface Props extends JSX.HTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Text({label, class: className, ...props}: Props) {
  return (
    <label class="flex flex-col flex-grow">
      <div class="px-2 text-sm">
        {label}
      </div>

      <input
        {...props}
        class={`px-2 py-1 border(gray-200 2) rounded w-full ${className}`}
      />
    </label>
  );
}
