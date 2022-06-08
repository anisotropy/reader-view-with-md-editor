import { useForm, useWatch } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import InputArticlePresener from "components/InputArticle";

export type FormInput = {
  source: "url" | "html";
  url: string;
  html: string;
};

type InputArticleProps = {
  onChangeArticle: (article: { origin: string; readable: string }) => void;
  onClose: () => void;
};

const InputArticle = ({ onChangeArticle, onClose }: InputArticleProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { register, control, handleSubmit, setFocus } = useForm<FormInput>({
    defaultValues: { source: "url", url: "", html: "" },
  });
  const [formData, setFormData] = useState<FormInput | null>(null);

  const source = useWatch({ control, name: "source" });
  const url = useWatch({ control, name: "url" });
  const html = useWatch({ control, name: "html" });

  const canSubmit = Boolean(
    (source === "html" && html) || (source === "url" && url)
  );

  const onSubmit = handleSubmit(async (data) => {
    if (!canSubmit) return;
    setFormData(data);
    setIsProcessing(true);
  });

  const onFinshMakeReadable = useCallback(
    (article: { origin: string; readable: string } | null) => {
      if (article) {
        onChangeArticle(article);
      } else {
        setFormData(null);
        setIsProcessing(false);
      }
    },
    [onChangeArticle]
  );

  useEffect(() => {
    setFocus(source);
  }, [setFocus, source]);

  const registerRadio = () => register("source");

  const registerInput = (theSource: "url" | "html") =>
    register(theSource, { disabled: theSource !== source || isProcessing });

  return (
    <InputArticlePresener
      {...{
        isProcessing,
        source,
        formData,
        canSubmit,
        registerRadio,
        registerInput,
        onFinshMakeReadable,
        onClose,
        onSubmit,
      }}
    />
  );
};

export default InputArticle;
