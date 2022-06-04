import classNames from "classnames";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownViewer = {
  markdown: string;
  className?: string;
};

const MarkdownViewer = ({ markdown, className }: MarkdownViewer) => {
  return (
    <article
      className={classNames(
        "prose dark:prose-invert dark:prose-pre:bg-zinc-800",
        className
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </article>
  );
};

export default MarkdownViewer;
