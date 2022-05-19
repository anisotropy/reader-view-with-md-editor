import { useState } from "react";
import axios from "axios";
import DiffChecker from "./DiffChecker";
import InputUrl from "./InputUrl";
import MarkdownViewer from "./MarkdownViewer";

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
    <div className="text-slate-700">
      <InputUrl onChangeUrl={onWebClip} />
      <div>
        <DiffChecker
          oldDoc={article.origin}
          newDoc={article.readible}
          onChangeArticle={onChangeArticle}
        />
        <MarkdownViewer markdown={article.readible} />
      </div>
    </div>
  );
};

export default App;
