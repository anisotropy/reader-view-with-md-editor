import React, { useState, useEffect, useRef } from "react";
import DiffChecker from "./DiffChecker";
import MarkdownViewer from "./MarkdownViewer";
import ScrollSync from "./ScrollSync";

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
      viewer={<MarkdownViewer markdown={localArticle.readable} />}
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
