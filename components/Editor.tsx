import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import rehypeSanitize from "rehype-sanitize";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

const MdEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const example = `
  \`\`\`
  a = 1
  \`\`\`
`;

const Editor = () => {
  const [commands, setCommands] = useState<any>();

  const loadCommands = async () => {
    const mod = await import("@uiw/react-md-editor");
    setCommands(mod.commands);
  };

  useEffect(() => {
    loadCommands();
  }, []);

  const [value, setValue] = useState<string>(example);
  return (
    commands && (
      <div>
        <MdEditor
          value={value}
          onChange={(value) => setValue(value || "")}
          previewOptions={{
            rehypePlugins: [[rehypeSanitize]],
          }}
          preview="edit"
        />
        <ReactMarkdown>{value}</ReactMarkdown>
      </div>
    )
  );
};

export default Editor;
