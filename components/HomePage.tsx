import { useState } from "react";
import DiffChecker from "./DiffChecker";
import InputUrl from "./InputUrl";

export type Article = { origin: string; readible: string };

const Home = () => {
  const [article, setArticle] = useState<Article>({ origin: "", readible: "" });

  return (
    <>
      <InputUrl setArticle={setArticle} />
      <DiffChecker article={article} />
    </>
  );
};

export default Home;
