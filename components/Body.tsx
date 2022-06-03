import React, { useState, useEffect, useRef } from "react";
import Button from "./Button";
import DiffChecker from "./DiffChecker";
import Copy from "./icons/Copy";
import MarkdownViewer from "./MarkdownViewer";
import ScrollSync from "./ScrollSync";
import { CopyToClipboard } from "react-copy-to-clipboard";
import CheckMark from "./icons/CheckMark";
import FullScreenMax from "./icons/FullScreenMax";
import DocOnePage from "./icons/DocOnePage";

const headerClassName =
  "p-2 border-b m-border-slate m-text-slate " +
  "flex justify-between items-center";

const ViewerHeader = (props: { onExpand: () => void }) => {
  return (
    <div className={headerClassName}>
      <span>Reader Mode</span>{" "}
      <Button text="Expand" Icon={FullScreenMax} onClick={props.onExpand} />
    </div>
  );
};

const EditorHeader = (props: { readable: string; onOpenInput: () => void }) => {
  const [isCopied, setIsCopied] = useState(false);

  const onCopy = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  useEffect(() => {
    setIsCopied(false);
  }, [props.readable]);

  return (
    <div className={headerClassName}>
      <span>Markdown Editor</span>
      <div className="flex space-x-2">
        <Button
          text="Webpage"
          color="blue"
          Icon={DocOnePage}
          onClick={props.onOpenInput}
        />
        <CopyToClipboard text={props.readable} onCopy={onCopy}>
          <Button
            border={isCopied}
            text={isCopied ? "Copied" : "Copy"}
            Icon={isCopied ? CheckMark : Copy}
          />
        </CopyToClipboard>
      </div>
    </div>
  );
};

type BodyProps = {
  article: { origin: string; readable: string };
  onExpandViewer: (markdown: string) => void;
  onOpenInput: () => void;
};

const Body = ({ article, onExpandViewer, onOpenInput }: BodyProps) => {
  const [localArticle, setLocalArticle] = useState({
    origin: "",
    readable: "",
  });
  const editorLineEls = useRef<React.RefObject<HTMLDivElement>[]>([]);

  const onChangeArticle = (readable: string) => {
    editorLineEls.current = [];
    setLocalArticle({ ...localArticle, readable });
  };

  const onMountLineEl = (
    index: number,
    element: React.RefObject<HTMLDivElement>
  ) => {
    editorLineEls.current[index] = element;
  };

  const onExpand = () => {
    onExpandViewer(localArticle.readable);
  };

  useEffect(() => {
    editorLineEls.current = [];
    setLocalArticle(article);
  }, [article]);

  return (
    <ScrollSync
      viewerHeader={<ViewerHeader onExpand={onExpand} />}
      viewer={<MarkdownViewer markdown={localArticle.readable} />}
      editorHeader={
        <EditorHeader
          readable={localArticle.readable}
          onOpenInput={onOpenInput}
        />
      }
      editor={
        <DiffChecker
          oldDoc={localArticle.origin}
          newDoc={localArticle.readable}
          onChangeArticle={onChangeArticle}
          onMountLineEl={onMountLineEl}
        />
      }
      editorLineEls={editorLineEls.current}
    />
  );
};

export default Body;
