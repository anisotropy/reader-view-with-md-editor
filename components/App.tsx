import React, { useState } from "react";
import axios from "axios";
import Body from "./Body";
import InputUrl from "./InputUrl";

const App = () => {
  const [article, setArticle] = useState({
    origin: "kkk\nccc\naaa",
    readible: "kkz\naaa\nbbb",
  });

  const onWebClip = async (url: string) => {
    const { data } = await axios.get(`/api/web-clip?url=${encodeURI(url)}`);
    setArticle(data);
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
