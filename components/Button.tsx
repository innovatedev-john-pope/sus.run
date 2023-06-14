import { JSX } from "preact";


export function Button({class: className, ...props}: JSX.HTMLAttributes<HTMLButtonElement|HTMLAnchorElement>) {
  const buttonClass = `px-2 py-1 border(gray-100 2) bg-red-800 hover:bg-red-600 text-white rounded-lg ${className}`

  return <>
    {props.href ?
      <a {...(props as JSX.HTMLAttributes<HTMLAnchorElement>)} class={buttonClass} />
    :
      <button
        {...(props as JSX.HTMLAttributes<HTMLButtonElement>)}
        class={buttonClass}
      />
    }
  </>
}
