import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownViewer = {
  markdown: string;
};

const MarkdownViewer = ({ markdown }: MarkdownViewer) => {
  return (
    <article className="prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </article>
  );
};

export default MarkdownViewer;
