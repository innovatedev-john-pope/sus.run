import { JSX } from "preact";


export function Button({class: className, ...props}: JSX.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      class={`px-2 py-1 border(gray-100 2) bg-red-800 hover:bg-red-600 text-white rounded-lg ${className}`}
    />
  );
}
