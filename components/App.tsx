import React, { useState } from "react";
import Body from "./Body";
import InputArticle from "./InputArticle";
import webClip from "apis/webClip";

const App = () => {
  const [article, setArticle] = useState({
    origin: "kkk\nccc\naaa",
    readable: "kkz\naaa\nbbb",
  });

  const onWebClip = async (url: string) => {
    const res = await webClip({ url });
    setArticle(res);
  };

  return (
    <div className="flex flex-col items-center h-screen">
      <div className="flex-none">
        <InputArticle onChangeArticle={() => {}} />
      </div>
      <div className="flex-1 p-4 w-full max-w-7xl overflow-hidden">
        <Body article={article} />
      </div>
    </div>
  );
};

export default App;
