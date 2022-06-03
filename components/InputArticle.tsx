import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import Button from "./Button";
import Radio from "./Radio";
import classNames from "classnames";
import Backdrop from "./Backdrop";
import { useCallback, useEffect, useState } from "react";
import Dismiss from "./icons/Dismiss";
import DocOnePage from "./icons/DocOnePage";
import MakeReadable from "./MakeReadable";

type FormInput = {
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

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    if (!canSubmit) return;
    setFormData(data);
    setIsProcessing(true);
  };

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

  const inputClassName =
    "flex-1 p-1 " +
    "border border-transparent outline-none " +
    "placeholder:m-text-gray" +
    "m-bg-white disabled:bg-transparent disabled:m-border-gray disabled:m-text-gray " +
    "focus:m-border-slate";

  return (
    <Backdrop>
      <div className="w-full p-4 max-w-2xl m-bg-white m-text-slate rounded-md">
        <h1 className="flex text-lg items-center space-x-1">
          <DocOnePage className="w-6 fill-current" /> <span>Webpage</span>
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-4 w-full space-y-4 text-sm"
        >
          <div className="flex">
            <Radio
              {...register("source")}
              value="url"
              selectedValue={source}
              className="w-8"
              disabled={isProcessing}
            />
            <input
              {...register("url", {
                disabled: source !== "url" || isProcessing,
              })}
              autoComplete="off"
              placeholder="URL"
              className={inputClassName}
            />
          </div>
          <div className="flex">
            <Radio
              {...register("source")}
              value="html"
              selectedValue={source}
              className="w-8"
              disabled={isProcessing}
            />
            <textarea
              {...register("html", {
                disabled: source !== "html" || isProcessing,
              })}
              placeholder="Put HTML code"
              className={classNames(inputClassName, "resize-none h-36")}
            />
          </div>
          <div className="flex space-x-4">
            <MakeReadable
              url={formData?.url}
              html={formData?.html}
              disabled={!canSubmit}
              onFinish={onFinshMakeReadable}
            />
            <Button
              border
              Icon={Dismiss}
              text="Cancel"
              onClick={onClose}
              disabled={isProcessing}
            />
          </div>
        </form>
      </div>
    </Backdrop>
  );
};

export default InputArticle;
