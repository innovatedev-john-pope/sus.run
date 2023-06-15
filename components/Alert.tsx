import { JSX } from "preact";

interface Props extends JSX.HTMLAttributes<HTMLDivElement> {
  type: 'warning'|'error'|'danger'|'success'|'info';
}

export function Alert({type, children, class: className, ...props}: Props) {
  const color = {
    warning: 'yellow',
    error: 'red',
    danger: 'red',
    success: 'green',
    info: 'blue',
  }[type];

  const alertClass = `mx-auto my-4 p-4 bg-${color}-100 text-${color}-800 border(${color}-800 2) rounded max-w-lg ${className??''}`

  return (
    <div {...props} class={alertClass}>
      {children}
    </div>
  );
}
