import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import DiffChecker from "./DiffChecker";
import MarkdownViewer from "./MarkdownViewer";
import ScrollSync from "./ScrollSync";

type BodyProps = { url: string };

const Body = ({ url }: BodyProps) => {
  const [article, setArticle] = useState({
    origin: "kkk\nccc\naaa",
    readible: "kkz\naaa\nbbb",
  });

  const editorLineSizes = useRef<{ top: number; height: number }[]>([]);

  const onWebClip = async (url: string) => {
    const { data } = await axios.get(`/api/web-clip?url=${encodeURI(url)}`);
    editorLineSizes.current = [];
    setArticle(data);
  };

  useEffect(() => {
    if (!url) return;
    onWebClip(url);
  }, [url]);

  const onChangeArticle = (readible: string) => {
    editorLineSizes.current = [];
    setArticle({ ...article, readible });
  };

  const onChangeLineSize = (lineId: number, top: number, height: number) => {
    editorLineSizes.current[lineId] = { top, height };
  };

  return (
    <ScrollSync
      viewer={<MarkdownViewer markdown={article.readible} />}
      editor={
        <DiffChecker
          oldDoc={article.origin}
          newDoc={article.readible}
          onChangeArticle={onChangeArticle}
          onChangeLineSize={onChangeLineSize}
        />
      }
      editorLineSizes={editorLineSizes.current}
    />
  );
};

export default Body;
