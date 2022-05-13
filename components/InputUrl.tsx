import React, { useState } from "react";
import { Article } from "./HomePage";

type InputUrlProps = { onChangeUrl: (url: string) => void };

const InputUrl = ({ onChangeUrl }: InputUrlProps) => {
  const [url, setUrl] = useState("https://www.daleseo.com/react-suspense/");

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setUrl(event.target.value);
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    onChangeUrl(url);
  };

  return (
    <form onSubmit={onSubmit}>
      <input className="border" type="text" value={url} onChange={onChange} />
      <button type="submit">submit</button>
    </form>
  );
};

export default InputUrl;
