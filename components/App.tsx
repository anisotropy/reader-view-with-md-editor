import { useState } from "react";
import axios from "axios";
import DiffChecker from "./DiffChecker";
import InputUrl from "./InputUrl";
import MarkdownViewer from "./MarkdownViewer";
import classNames from "classnames";

export type Article = { origin: string; readible: string };

const App = () => {
  const [article, setArticle] = useState<Article>({
    origin: "kkk\nccc\naaa",
    readible: "kkz\naaa\nbbb",
  });

  const onWebClip = async (url: string) => {
    const { data } = await axios.get(`/api/web-clip?url=${encodeURI(url)}`);
    setArticle(data);
  };

  const onChangeArticle = (readible: string) => {
    setArticle({ ...article, readible });
  };

  return (
    <div className="flex flex-col items-center h-screen">
      <InputUrl onChangeUrl={onWebClip} />
      <div className="flex-1 overflow-hidden grid grid-rows-2 md:grid-rows-1 md:grid-cols-2 m-4 max-w-7xl">
        <div
          className={classNames(
            "overflow-y-scroll",
            "border-slate-400",
            "border border-b-0 rounded-t-lg",
            "md:border md:rounded-none md:border-r-0 md:rounded-l-lg p-2"
          )}
        >
          <MarkdownViewer markdown={article.readible} />
        </div>
        <div
          role="table"
          className={classNames(
            "overflow-y-scroll",
            "border border-slate-400",
            "rounded-b-lg md:rounded-none md:rounded-r-lg"
          )}
        >
          <DiffChecker
            oldDoc={article.origin}
            newDoc={article.readible}
            onChangeArticle={onChangeArticle}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
