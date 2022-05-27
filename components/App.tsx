import classNames from "classnames";
import React, { useState } from "react";
import Body from "./Body";
import Button from "./Button";
import FullScreenMin from "./icons/FullScreenMim";
import FullScreenViewer from "./icons/FullScreenViewer";
import InputArticle from "./InputArticle";
import MarkdownViewer from "./MarkdownViewer";

const App = () => {
  const [article, setArticle] = useState({
    origin: "kkk\nccc\naaa",
    readable: "kkz\naaa\nbbb",
  });

  const [showInput, setShowInput] = useState(false);
  const [markdown, setMarkdown] = useState<string | null>(null);

  const onChangeArticle = (article: { origin: string; readable: string }) => {
    setArticle(article);
    setShowInput(false);
  };

  const onShowInput = () => {
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
          "flex flex-col items-center h-screen": true,
          hidden: markdown !== null,
        })}
      >
        <div className="w-full">
          <Button text="Webpage" onClick={onShowInput} />
        </div>
        <div className="flex-1 p-4 w-full max-w-7xl overflow-hidden">
          <Body article={article} onExpandViewer={onExpandViewer} />
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
