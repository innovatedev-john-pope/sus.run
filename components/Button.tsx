import { JSX } from "preact";

interface Props extends JSX.HTMLAttributes<HTMLButtonElement|HTMLAnchorElement> {
  color?: string;
}

export function Button({class: className, color="red", ...props}: Props) {
  const buttonClass = `px-2 py-1 border(gray-100 2) bg-${color}-800 hover:bg-${color}-600 text-white rounded-lg ${className}`

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
