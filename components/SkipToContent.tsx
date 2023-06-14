export default function SkipToContent({ target = "main" }: { target?: string }) {
  return (
    <a href={`#${target}`} class="absolute top-[-40px] left-0 bg-white text-black p-2 z-9999 text-sm transition:top duration-300 ease-in-out focus:top-0">
      Skip to Content
    </a>
  );
}