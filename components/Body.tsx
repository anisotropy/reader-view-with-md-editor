import classNames from "classnames";
import React, { useState, useEffect, useRef } from "react";
import Button from "./Button";
import DiffChecker from "./DiffChecker";
import Copy from "./icons/Copy";
import Expand from "./icons/Expand";
import MarkdownViewer from "./MarkdownViewer";
import ScrollSync from "./ScrollSync";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Check from "./icons/Check";
import CheckMark from "./icons/CheckMark";

const headerClassName =
  "font-bold p-2 border-b border-slate-400 bg-gray-100 text-slate-700 " +
  "flex justify-between items-center";

const ViewerHeader = () => {
  return (
    <div className={headerClassName}>
      <span>Reader View</span> <Button text="Expand" icon={<Expand />} />
    </div>
  );
};

const EditorHeader = (props: { readable: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  const onCopy = () => {
    setIsCopied(true);
  };

  useEffect(() => {
    setIsCopied(false);
  }, [props.readable]);

  return (
    <div className={classNames(headerClassName)}>
      <span>Markdown Editor</span>
      <CopyToClipboard text={props.readable} onCopy={onCopy}>
        <Button
          text={isCopied ? "Copied" : "Copy"}
          icon={isCopied ? <CheckMark /> : <Copy />}
          color={isCopied ? "slate" : "blue"}
        />
      </CopyToClipboard>
    </div>
  );
};

type BodyProps = { article: { origin: string; readable: string } };

const Body = ({ article }: BodyProps) => {
  const [localArticle, setLocalArticle] = useState({
    origin: "",
    readable: "",
  });
  const editorLineSizes = useRef<{ top: number; height: number }[]>([]);

  const onChangeArticle = (readable: string) => {
    editorLineSizes.current = [];
    setLocalArticle({ ...localArticle, readable });
  };

  const onChangeLineSize = (lineId: number, top: number, height: number) => {
    editorLineSizes.current[lineId] = { top, height };
  };

  useEffect(() => {
    editorLineSizes.current = [];
    setLocalArticle(article);
  }, [article]);

  return (
    <ScrollSync
      viewerHeader={<ViewerHeader />}
      viewer={<MarkdownViewer markdown={localArticle.readable} />}
      editorHeader={<EditorHeader readable={localArticle.readable} />}
      editor={
        <DiffChecker
          oldDoc={localArticle.origin}
          newDoc={localArticle.readable}
          onChangeArticle={onChangeArticle}
          onChangeLineSize={onChangeLineSize}
        />
      }
      editorLineSizes={editorLineSizes.current}
    />
  );
};

export default Body;
