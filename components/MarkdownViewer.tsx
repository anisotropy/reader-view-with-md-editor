import classNames from "classnames";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownViewer = {
  markdown: string;
};

const MarkdownViewer = ({ markdown }: MarkdownViewer) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ node, ...props }) => <h1 className="text-2xl" {...props} />,
        h2: ({ node, ...props }) => <h1 className="text-xl" {...props} />,
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
};

export default MarkdownViewer;
