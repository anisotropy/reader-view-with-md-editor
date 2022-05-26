import React, { useState } from "react";
import Body from "./Body";
import InputUrl from "./InputUrl";
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

  const onChangeUrl = (url: string) => {
    onWebClip(url);
  };

  return (
    <div className="flex flex-col items-center h-screen">
      <div className="flex-none">
        <InputUrl onChangeUrl={onChangeUrl} />
      </div>
      <div className="flex-1 p-4 w-full max-w-7xl overflow-hidden">
        <Body article={article} />
      </div>
    </div>
  );
};

export default App;
