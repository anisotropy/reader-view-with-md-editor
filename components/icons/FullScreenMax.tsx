export default function FullScreenMax({ className }: { className?: string }) {
  return (
    <svg
      className={"w-5 fill-current" + (className ? ` ${className}` : "")}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4.5 5.75c0-.69.56-1.25 1.25-1.25h2a.75.75 0 0 0 0-1.5h-2A2.75 2.75 0 0 0 3 5.75v2a.75.75 0 0 0 1.5 0v-2ZM4.5 18.25c0 .69.56 1.25 1.25 1.25h2a.75.75 0 0 1 0 1.5h-2A2.75 2.75 0 0 1 3 18.25v-2a.75.75 0 0 1 1.5 0v2ZM18.25 4.5c.69 0 1.25.56 1.25 1.25v2a.75.75 0 0 0 1.5 0v-2A2.75 2.75 0 0 0 18.25 3h-2a.75.75 0 0 0 0 1.5h2ZM19.5 18.25c0 .69-.56 1.25-1.25 1.25h-2a.75.75 0 0 0 0 1.5h2A2.75 2.75 0 0 0 21 18.25v-2a.75.75 0 0 0-1.5 0v2Z" />
    </svg>
  );
}
