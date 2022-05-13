import { useState } from "react";
import DiffChecker from "./DiffChecker";
import InputUrl from "./InputUrl";

export type Article = { origin: string; readible: string };

const Home = () => {
  const [article, setArticle] = useState<Article>({ origin: "", readible: "" });

  const onChangeArticle = (readible: string) => {
    setArticle({ ...article, readible });
  };

  return (
    <div className="text-slate-700">
      <InputUrl setArticle={setArticle} />
      <DiffChecker article={article} onChangeArticle={onChangeArticle} />
    </div>
  );
};

export default Home;
