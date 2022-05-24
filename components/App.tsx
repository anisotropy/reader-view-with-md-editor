import React, { useRef, useState, useMemo } from "react";
import axios from "axios";
import DiffChecker from "./DiffChecker";
import InputUrl from "./InputUrl";
import MarkdownViewer from "./MarkdownViewer";
import classNames from "classnames";
import { throttle } from "lodash";

export type Article = { origin: string; readible: string };

const App = () => {
  // scroll sync ////
  const editorLineSizes = useRef<{ top: number; height: number }[]>([]);
  //

  const [article, setArticle] = useState<Article>({
    origin: "kkk\nccc\naaa",
    readible: "kkz\naaa\nbbb",
  });

  const onWebClip = async (url: string) => {
    const { data } = await axios.get(`/api/web-clip?url=${encodeURI(url)}`);
    editorLineSizes.current = [];
    setArticle(data);
  };

  const onChangeArticle = (readible: string) => {
    editorLineSizes.current = [];
    setArticle({ ...article, readible });
  };

  // scroll sync ////
  const editorEl = useRef<HTMLDivElement>(null);
  const viewerEl = useRef<HTMLDivElement>(null);
  const [scrollSide, setScrollSide] = useState<"viewer" | "editor" | null>(
    null
  );

  const onMountLine = (lineId: number, top: number, height: number) => {
    editorLineSizes.current[lineId] = { top, height };
  };

  const setEditorScrollTop = (viewerScrollTop: number) => {
    if (!editorEl?.current || !viewerEl?.current) return;

    const viewerScrollRatio =
      viewerScrollTop /
      (viewerEl.current.scrollHeight - viewerEl.current.clientHeight);

    const partialScrollHeight = editorLineSizes.current.reduce(
      (sum, lineSize) => (lineSize ? sum + lineSize.height : sum),
      0
    );

    const relScrollTop =
      (partialScrollHeight - editorEl.current.clientHeight) * viewerScrollRatio;

    const { top } = editorLineSizes.current.reduce(
      ({ relTop, top }, lineSize) => {
        if (!lineSize) return { relTop, top };
        const nextRelTop = relTop + lineSize.height;
        if (relTop <= relScrollTop && relScrollTop < nextRelTop) {
          top = lineSize.top + relScrollTop - relTop;
        }
        return { relTop: nextRelTop, top };
      },
      { relTop: 0, top: 0 }
    );

    editorEl.current.scrollTop = top - editorEl.current.offsetTop;
  };

  const setThrottledEditorScrollTop = useMemo(
    () => throttle(setEditorScrollTop, 100),
    []
  );

  const onViewerScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (scrollSide !== "viewer") return;
    setThrottledEditorScrollTop(event.currentTarget.scrollTop);
  };

  const setViewerScrollTop = (editorScrollTop: number) => {
    if (!editorEl?.current || !viewerEl?.current) return;
    const top = editorScrollTop + editorEl.current.offsetTop;

    const { partialScrollHeight, theRelTop } = editorLineSizes.current.reduce(
      ({ partialScrollHeight, theRelTop }, lineSize) => {
        if (!lineSize) return { partialScrollHeight, theRelTop };
        if (lineSize.top <= top && top < lineSize.top + lineSize.height) {
          theRelTop = partialScrollHeight + top - lineSize.top;
        }
        partialScrollHeight += lineSize.height;
        return { partialScrollHeight, theRelTop };
      },
      { partialScrollHeight: 0, theRelTop: -1 }
    );
    if (theRelTop >= 0) {
      const scrollRatio =
        theRelTop / (partialScrollHeight - editorEl.current.clientHeight);
      viewerEl.current.scrollTop =
        scrollRatio *
        (viewerEl.current.scrollHeight - viewerEl.current.clientHeight);
    } else if (
      top <= (editorLineSizes.current.find((lineSize) => lineSize)?.top || -1)
    ) {
      viewerEl.current.scrollTop = 0;
    }
  };

  const setThrottledViewerScrollTop = useMemo(
    () => throttle(setViewerScrollTop, 100),
    []
  );

  const onEditorScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (scrollSide !== "editor") return;
    setThrottledViewerScrollTop(event.currentTarget.scrollTop);
  };

  const onViwerMouseMove = () => {
    setScrollSide("viewer");
  };

  const onEditorMouseMove = () => {
    setScrollSide("editor");
  };
  //

  return (
    <div className="flex flex-col items-center h-screen">
      <InputUrl onChangeUrl={onWebClip} />
      <div className="flex-1 overflow-hidden grid grid-rows-2 md:grid-rows-1 md:grid-cols-2 m-4 max-w-7xl">
        <div
          ref={viewerEl}
          className={classNames(
            "overflow-y-scroll",
            "border-slate-400",
            "border border-b-0 rounded-t-lg",
            "md:border md:rounded-none md:border-r-0 md:rounded-l-lg p-2"
          )}
          onScroll={onViewerScroll}
          onMouseMove={onViwerMouseMove}
        >
          <MarkdownViewer markdown={article.readible} />
        </div>
        <div
          role="table"
          ref={editorEl}
          className={classNames(
            "overflow-y-scroll",
            "border border-slate-400",
            "rounded-b-lg md:rounded-none md:rounded-r-lg"
          )}
          onScroll={onEditorScroll}
          onMouseMove={onEditorMouseMove}
        >
          <DiffChecker
            oldDoc={article.origin}
            newDoc={article.readible}
            onChangeArticle={onChangeArticle}
            onMountLine={onMountLine}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
