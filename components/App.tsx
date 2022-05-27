import React, { useState } from "react";
import Body from "./Body";
import Button from "./Button";
import InputArticle from "./InputArticle";

const App = () => {
  const [article, setArticle] = useState({
    origin: "kkk\nccc\naaa",
    readable: "kkz\naaa\nbbb",
  });

  const [showInput, setShowInput] = useState(false);

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

  return (
    <>
      <div className="flex flex-col items-center h-screen">
        <div className="w-full">
          <Button text="Webpage" onClick={onShowInput} />
        </div>
        <div className="flex-1 p-4 w-full max-w-7xl overflow-hidden">
          <Body article={article} />
        </div>
      </div>
      {showInput && (
        <InputArticle
          onChangeArticle={onChangeArticle}
          onClose={onCloseInput}
        />
      )}
    </>
  );
};

export default App;
