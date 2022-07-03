import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import Button from "./Button";
import GitHub from "./icons/GitHub";
import Maximize from "./icons/Maximize";
import Minimize from "./icons/Minimize";
import ThemeButton from "./ThemeButton";

function useLocalStorage<T>(
  key: string,
  initialState: T
): [T, (state: T) => void] {
  const [state, setState] = useState<T>(initialState);

  const setLocalStorage = useCallback(
    (newState: T) => {
      window?.localStorage.setItem(key, JSON.stringify(newState));
      setState(newState);
    },
    [key]
  );

  const useIsoLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

  useIsoLayoutEffect(() => {
    const localStorageState: T = JSON.parse(
      window.localStorage.getItem(key) ?? JSON.stringify(initialState)
    );
    setState(localStorageState);
  }, [key, initialState]);

  return [state, setLocalStorage];
}

const Header = () => {
  const [isShirinked, setIsShirinked] = useLocalStorage(
    "Hadder:isShrinked",
    false
  );

  const onShrink = () => {
    setIsShirinked(true);
  };

  const onExpand = () => {
    setIsShirinked(false);
  };

  const title = "Reader Mode View with Markdown Editor";

  const otherButtons = (
    <>
      <ThemeButton />
      <Button
        circle
        Icon={GitHub}
        border
        href="https://github.com/anisotropy/reader-view-with-md-editor"
      />
    </>
  );

  return isShirinked ? (
    <div className="flex items-center space-x-2 mb-2 m-text-slate">
      <h1>{title}</h1>
      <div className="flex space-x-2">
        <Button Icon={Maximize} border circle onClick={onExpand} />
        {otherButtons}
      </div>
    </div>
  ) : (
    <div className="max-w-xl mb-2 m-text-slate">
      <h1 className="text-center text-2xl font-bold">{title}</h1>
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
        <Button text="Shrink" Icon={Minimize} border onClick={onShrink} />
        <div className="flex space-x-2">{otherButtons}</div>
      </div>
    </div>
  );
};

export default Header;
