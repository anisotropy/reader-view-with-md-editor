import React, { useRef, useState, useMemo, useCallback } from "react";
import classNames from "classnames";
import { throttle } from "lodash";

type ScrollSyncProps = {
  viewer: React.ReactNode;
  editor: React.ReactNode;
  editorLineSizes: { top: number; height: number }[];
};

const ScrollSync = ({ viewer, editor, editorLineSizes }: ScrollSyncProps) => {
  const editorEl = useRef<HTMLDivElement>(null);
  const viewerEl = useRef<HTMLDivElement>(null);
  const [scrollSide, setScrollSide] = useState<"viewer" | "editor" | null>(
    null
  );

  const setEditorScrollTop = useCallback(
    (viewerScrollTop: number) => {
      if (!editorEl?.current || !viewerEl?.current) return;

      const viewerScrollRatio =
        viewerScrollTop /
        (viewerEl.current.scrollHeight - viewerEl.current.clientHeight);

      const partialScrollHeight = editorLineSizes.reduce(
        (sum, lineSize) => (lineSize ? sum + lineSize.height : sum),
        0
      );

      const relScrollTop =
        (partialScrollHeight - editorEl.current.clientHeight) *
        viewerScrollRatio;

      const { top } = editorLineSizes.reduce(
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
    },
    [editorLineSizes]
  );

  const setThrottledEditorScrollTop = useMemo(
    () => throttle(setEditorScrollTop, 100),
    [setEditorScrollTop]
  );

  const onViewerScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (scrollSide !== "viewer") return;
    setThrottledEditorScrollTop(event.currentTarget.scrollTop);
  };

  const setViewerScrollTop = useCallback(
    (editorScrollTop: number) => {
      if (!editorEl?.current || !viewerEl?.current) return;
      const top = editorScrollTop + editorEl.current.offsetTop;

      const { partialScrollHeight, theRelTop } = editorLineSizes.reduce(
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
        top <= (editorLineSizes.find((lineSize) => lineSize)?.top || -1)
      ) {
        viewerEl.current.scrollTop = 0;
      }
    },
    [editorLineSizes]
  );

  const setThrottledViewerScrollTop = useMemo(
    () => throttle(setViewerScrollTop, 100),
    [setViewerScrollTop]
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

  return (
    <div className="w-full h-full grid grid-rows-2 md:grid-rows-1 md:grid-cols-2">
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
        {viewer}
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
        {editor}
      </div>
    </div>
  );
};

export default ScrollSync;
