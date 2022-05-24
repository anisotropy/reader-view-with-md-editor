import React, { useState } from "react";
import Body from "./Body";
import InputUrl from "./InputUrl";

const App = () => {
  const [url, setUrl] = useState("");
  const onChangeUrl = (url: string) => {
    setUrl(encodeURI(url));
  };

  return (
    <div className="flex flex-col items-center h-screen">
      <InputUrl onChangeUrl={onChangeUrl} />
      <Body url={url} />
    </div>
  );
};

export default App;
