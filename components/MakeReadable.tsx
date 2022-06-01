import webClip, { WebClipRes } from "apis/webClip";
import { useCallback, useEffect, useState } from "react";
import Button from "./Button";
import ErrorMessage from "./ErrorMessage";
import Check from "./icons/Check";
import Clock from "./icons/Clock";

type MakeReadableProps = {
  disabled?: boolean;
  url?: string;
  html?: string;
  onFinish: (article: WebClipRes | null) => void;
};

const useWebClip = ({ url, html }: { url?: string; html?: string }) => {
  const [res, setRes] = useState<{ data: WebClipRes | null; error: any }>({
    data: null,
    error: null,
  });

  const doWebClip = useCallback(async () => {
    if (!url && !html) {
      setRes({ data: null, error: null });
      return;
    }
    try {
      const res = await webClip({ url, html });
      setRes({ data: res, error: null });
    } catch (error) {
      setRes({ data: null, error });
    }
  }, [url, html]);

  useEffect(() => {
    doWebClip();
  }, [doWebClip]);

  return { data: res.data, error: res.error };
};

const MakeReadable = ({ disabled, url, html, onFinish }: MakeReadableProps) => {
  const { data, error } = useWebClip({ url, html });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onClose = () => {
    setErrorMessage(null);
    onFinish(null);
  };

  useEffect(() => {
    if (error) {
      if (error.response.data.error.code !== "no req") {
        setErrorMessage(error.response.data.error.code);
      }
    } else if (data) {
      onFinish(data);
    }
  }, [data, error]); // eslint-disable-line

  if ((url || html) && !data && !error)
    return <Button text="Processing..." Icon={Clock} iconSpin disabled />;

  return (
    <>
      <Button submit Icon={Check} text="Make Readable" disabled={disabled} />
      {errorMessage && (
        <ErrorMessage onClose={onClose}>{errorMessage}</ErrorMessage>
      )}
    </>
  );
};

export default MakeReadable;
