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

  const [editorScrollTop, setEditorScrollTop] = useState<number | null>(null);
  const [scrollSide, setScrollSide] = useState<"viewer" | "editor" | null>(
    null
  );

  const onMountLine = (lineId: number, top: number, height: number) => {
    editorLineSizes.current[lineId] = { top, height };
  };

  const setThrottledViewerScrollRatio = useMemo(
    () =>
      throttle((viewerScrollRatio: number) => {
        if (!editorEl?.current) return;
        const partialScrollHeight = editorLineSizes.current.reduce(
          (sum, lineSize) => (lineSize ? sum + lineSize.height : sum),
          0
        );
        const relScrollTop =
          (partialScrollHeight - editorEl.current.clientHeight) *
          viewerScrollRatio;
        const { scrollTop } = editorLineSizes.current.reduce(
          ({ relTop, scrollTop }, lineSize) => {
            if (!lineSize) return { relTop, scrollTop };
            const nextRelTop = relTop + lineSize.height;
            if (relTop <= relScrollTop && relScrollTop < nextRelTop) {
              scrollTop =
                lineSize.top +
                relScrollTop -
                relTop -
                (editorEl.current?.offsetTop || 0);
            }
            return { relTop: nextRelTop, scrollTop };
          },
          { relTop: 0, scrollTop: 0 }
        );
        editorEl.current.scrollTop = scrollTop;
      }, 100),
    []
  );

  const onViewerScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (scrollSide !== "viewer") return;
    const target = event.currentTarget;
    const maxScrollTop = target.scrollHeight - target.clientHeight;
    const viewerScrollRatio = target.scrollTop / maxScrollTop;
    setEditorScrollTop(null);
    setThrottledViewerScrollRatio(viewerScrollRatio);
  };

  const onEditorScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (scrollSide !== "editor") return;
    setEditorScrollTop(event.currentTarget.scrollTop);
  };

  const onChangeEditorScrollTop = (scrollRatio: number) => {
    if (!viewerEl?.current) return;
    viewerEl.current.scrollTop =
      scrollRatio *
      (viewerEl.current.scrollHeight - viewerEl.current.clientHeight);
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
            wrapperHeight={editorEl?.current?.clientHeight}
            editorScrollTop={editorScrollTop}
            oldDoc={article.origin}
            newDoc={article.readible}
            onChangeArticle={onChangeArticle}
            onChangeEditorScrollTop={onChangeEditorScrollTop}
            onMountLine={onMountLine}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
