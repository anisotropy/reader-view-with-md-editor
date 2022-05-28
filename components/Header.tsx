import React, { useState } from "react";
import Button from "./Button";
import GitHub from "./icons/GitHub";
import Maximize from "./icons/Maximize";
import Minimize from "./icons/Minimize";

const Header = () => {
  const [isShirinked, setIsShirinked] = useState(false);

  const onShrink = () => {
    setIsShirinked(true);
  };

  const onExpand = () => {
    setIsShirinked(false);
  };

  return isShirinked ? (
    <div className="flex items-center space-x-4 mb-2 text-slate-700">
      <h1>Reader View Mode with Markdown Editor</h1>
      <Button text="Expand" Icon={Maximize} color="black" onClick={onExpand} />
    </div>
  ) : (
    <div className="max-w-xl mb-2 text-slate-700">
      <h1 className="text-center text-2xl font-bold">
        Reader View with Markdown Editor
      </h1>
      <p className="mt-2">
        Get rid of annoying ads or pop-ups on a webpage and read it on{" "}
        <b>reader mode</b> like{" "}
        <a
          href="https://chrome.google.com/webstore/detail/reader-view/ecabifbgmdmgdllomnfinbmaellmclnh"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          &quot;Reader View&quot; Chrome extension
        </a>
        . But you can <b>compare</b> the reader mode version and the original
        one, and edit it in <b>markdown</b> format, if you think too many things
        are removed.
      </p>
      <div className="flex mt-2 justify-between">
        <Button
          text="GitHub"
          Icon={GitHub}
          color="black"
          href="https://github.com/anisotropy/reader-view-with-md-editor"
        />
        <Button
          text="Shrink"
          Icon={Minimize}
          color="black"
          border
          onClick={onShrink}
        />
      </div>
    </div>
  );
};

export default Header;
