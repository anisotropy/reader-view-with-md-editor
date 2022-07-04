import React, { useRef, useState, useCallback, startTransition } from "react";
import classNames from "classnames";

type ScrollSyncProps = {
  viewer: React.ReactNode;
  editor: React.ReactNode;
  viewerHeader: React.ReactNode;
  editorHeader: React.ReactNode;
  editorLineEls: React.RefObject<HTMLDivElement>[];
};

const ScrollSync = ({
  viewer,
  editor,
  viewerHeader,
  editorHeader,
  editorLineEls,
}: ScrollSyncProps) => {
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

      const partialScrollHeight = editorLineEls.reduce(
        (sum, el) => (el.current ? sum + el.current.offsetHeight : sum),
        0
      );

      const relScrollTop =
        (partialScrollHeight - editorEl.current.clientHeight) *
        viewerScrollRatio;

      const { top } = editorLineEls.reduce(
        ({ relTop, top }, el) => {
          if (!el.current) return { relTop, top };
          const nextRelTop = relTop + el.current.offsetHeight;
          if (relTop <= relScrollTop && relScrollTop < nextRelTop) {
            top = el.current.offsetTop + relScrollTop - relTop;
          }
          return { relTop: nextRelTop, top };
        },
        { relTop: 0, top: 0 }
      );

      editorEl.current.scrollTop = top - editorEl.current.offsetTop;
    },
    [editorLineEls]
  );

  const onViewerScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      if (scrollSide !== "viewer") return;
      startTransition(() => {
        setEditorScrollTop(event.currentTarget.scrollTop);
      });
    },
    [scrollSide, setEditorScrollTop]
  );

  const setViewerScrollTop = useCallback(
    (editorScrollTop: number) => {
      if (!editorEl?.current || !viewerEl?.current) return;
      const top = editorScrollTop + editorEl.current.offsetTop;

      const { partialScrollHeight, theRelTop } = editorLineEls.reduce(
        ({ partialScrollHeight, theRelTop }, el) => {
          if (!el.current) return { partialScrollHeight, theRelTop };
          if (
            el.current.offsetTop <= top &&
            top < el.current.offsetTop + el.current.offsetHeight
          ) {
            theRelTop = partialScrollHeight + top - el.current.offsetTop;
          }
          partialScrollHeight += el.current.offsetHeight;
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
        top <=
        (editorLineEls.find((el) => el.current)?.current?.offsetTop || -1)
      ) {
        viewerEl.current.scrollTop = 0;
      }
    },
    [editorLineEls]
  );

  const onEditorScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      if (scrollSide !== "editor") return;
      startTransition(() => {
        setViewerScrollTop(event.currentTarget.scrollTop);
      });
    },
    [scrollSide, setViewerScrollTop]
  );

  const onViwerMouseMove = () => {
    setScrollSide("viewer");
  };

  const onEditorMouseMove = () => {
    setScrollSide("editor");
  };

  return (
    <div className="w-full h-full grid grid-rows-2 md:grid-rows-1 md:grid-cols-2">
      <div
        className={classNames(
          "flex flex-col overflow-hidden",
          "border border-slate-400 border-b-0 rounded-t-lg",
          "md:border md:rounded-none md:border-r-0 md:rounded-l-lg"
        )}
      >
        {viewerHeader}
        <div
          ref={viewerEl}
          className="flex-1 overflow-y-scroll  p-2"
          onScroll={onViewerScroll}
          onMouseMove={onViwerMouseMove}
        >
          {viewer}
        </div>
      </div>
      <div
        className={classNames(
          "flex flex-col overflow-hidden",
          "border border-slate-400",
          "rounded-b-lg md:rounded-none md:rounded-r-lg"
        )}
      >
        {editorHeader}
        <div
          role="table"
          ref={editorEl}
          className="flex-1 overflow-y-scroll"
          onScroll={onEditorScroll}
          onMouseMove={onEditorMouseMove}
        >
          {editor}
        </div>
      </div>
    </div>
  );
};

export default ScrollSync;
