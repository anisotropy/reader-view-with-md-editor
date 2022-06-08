import webClip, { WebClipError, WebClipRes, WebClipReq } from "apis/webClip";
import { useCallback, useEffect, useState } from "react";
import Button from "./Button";
import ErrorMessage from "./ErrorMessage";
import Check from "./icons/Check";
import Clock from "./icons/Clock";

type MakeReadableButtonProps = {
  disabled?: boolean;
  url?: string;
  html?: string;
  onFinish: (article: WebClipRes | null) => void;
};

const useWebClip = ({ url, html }: { url?: string; html?: string }) => {
  const [res, setRes] = useState<{
    data: WebClipRes | null;
    error: WebClipError | null;
  }>({
    data: null,
    error: null,
  });

  const doWebClip = useCallback(async ({ url, html }: WebClipReq) => {
    if (!url && !html) {
      setRes({ data: null, error: null });
      return;
    }
    try {
      const res = await webClip({ url, html });
      setRes({ data: res, error: null });
    } catch (error) {
      if (error instanceof WebClipError) {
        setRes({ data: null, error });
      }
    }
  }, []);

  useEffect(() => {
    doWebClip({ url, html });
  }, [url, html]); // eslint-disable-line

  return { data: res.data, error: res.error };
};

const MakeReadableButton = ({
  disabled,
  url,
  html,
  onFinish,
}: MakeReadableButtonProps) => {
  const { data, error } = useWebClip({ url, html });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onClose = () => {
    setErrorMessage(null);
    onFinish(null);
  };

  useEffect(() => {
    if (error) {
      setErrorMessage(error.message);
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

export default MakeReadableButton;
