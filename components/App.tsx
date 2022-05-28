import classNames from "classnames";
import React, { useState } from "react";
import Body from "./Body";
import Header from "./Header";
import FullScreenViewer from "./icons/FullScreenViewer";
import InputArticle from "./InputArticle";

const introduction = {
  origin: `# Reader Mode View with Markdown Editor\n\n[GitHub](https://github.com/anisotropy/reader-view-with-md-editor)\n\nGet rid of annoying ads or pop-ups on a webpage and read it on **reader mode** like [Reader View Chrome extension](https://chrome.google.com/webstore/detail/reader-view/ecabifbgmdmgdllomnfinbmaellmclnh). But you can **compare** the reader mode version and the original one, and edit it in **markdown** format, if you think too many things are removed.\n\n1. Click **Webpage** button and put a webpage address or HTML code.\n1. Click a line in **Markdown Editor**, and add, remove or edit the line.`,
  readable: `# Reader Mode View with Markdown Editor\n\nGet rid of annoying ads or pop-ups on a webpage and read it on **reader mode** like [Reader View Chrome extension](https://chrome.google.com/webstore/detail/reader-view/ecabifbgmdmgdllomnfinbmaellmclnh). But you can **compare** the reader mode version and the original one, and edit it in **markdown** format, if you think too many things are removed.\n\n1. Click **Webpage** button and put a webpage address or HTML code.\n1. Click a line in **Markdown Editor**, and add, remove or edit the line.\n\nVisit [GitHub](https://github.com/anisotropy/reader-view-with-md-editor) for more details.`,
};

const App = () => {
  const [article, setArticle] = useState({
    origin: introduction.origin,
    readable: introduction.readable,
  });

  const [showInput, setShowInput] = useState(false);
  const [markdown, setMarkdown] = useState<string | null>(null);

  const onChangeArticle = (article: { origin: string; readable: string }) => {
    setArticle(article);
    setShowInput(false);
  };

  const onOpenInput = () => {
    setShowInput(true);
  };

  const onCloseInput = () => {
    setShowInput(false);
  };

  const onExpandViewer = (markdonw: string) => {
    setMarkdown(markdonw);
  };

  const onShrinkViewer = () => {
    setMarkdown(null);
  };

  return (
    <>
      <div
        className={classNames({
          "flex flex-col items-center h-screen p-4": true,
          hidden: markdown !== null,
        })}
      >
        <Header />
        <div className="flex-1 w-full max-w-7xl overflow-hidden">
          <Body
            article={article}
            onExpandViewer={onExpandViewer}
            onOpenInput={onOpenInput}
          />
        </div>
      </div>
      {showInput && (
        <InputArticle
          onChangeArticle={onChangeArticle}
          onClose={onCloseInput}
        />
      )}
      {markdown !== null && (
        <FullScreenViewer markdown={markdown} onShrink={onShrinkViewer} />
      )}
    </>
  );
};

export default App;
