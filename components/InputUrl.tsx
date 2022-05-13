import React, { useState } from "react";
import axios from "axios";
import { Article } from "./HomePage";

type InputUrlProps = { setArticle: (article: Article) => void };

const InputUrl = (props: InputUrlProps) => {
  const [url, setUrl] = useState("https://www.daleseo.com/react-suspense/");

  const webClip = async () => {
    const { data } = await axios.get(`/api/web-clip?url=${encodeURI(url)}`);
    props.setArticle(data);
  };

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setUrl(event.target.value);
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    webClip();
    // setUrl("");
  };

  return (
    <form onSubmit={onSubmit}>
      <input className="border" type="text" value={url} onChange={onChange} />
      <button type="submit">submit</button>
    </form>
  );
};

export default InputUrl;
