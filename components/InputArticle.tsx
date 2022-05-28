import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import Button from "./Button";
import Radio from "./Radio";
import webClip from "apis/webClip";
import classNames from "classnames";
import Backdrop from "./Backdrop";
import Clock from "./icons/Clock";
import { useState } from "react";
import Check from "./icons/Check";
import Dismiss from "./icons/Dismiss";

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
  const { register, control, handleSubmit } = useForm<FormInput>({
    defaultValues: { source: "url", url: "", html: "" },
  });

  const source = useWatch({ control, name: "source" });
  const url = useWatch({ control, name: "url" });
  const html = useWatch({ control, name: "html" });

  const showSubmitButton =
    (source === "html" && html) || (source === "url" && url);

  const onSubmit: SubmitHandler<FormInput> = async ({ url, html }) => {
    if (!showSubmitButton) return;
    if (url || html) {
      setIsProcessing(true);
      const res = await webClip({ url, html });
      onChangeArticle(res);
    } else {
      // TODO: url과 html 모두 없을 때 경고 메시지 표시
    }
  };

  const inputClassName =
    "flex-1 p-1 " +
    "border border-orange-500 outline-none rounded " +
    "placeholder:text-slate-300, placeholder:italic " +
    "disabled:border-slate-300 disabled:text-slate-300 disabled:bg-transparent " +
    "focus:bg-orange-50 ";

  return (
    <Backdrop>
      <div className="w-full p-4 max-w-2xl bg-white text-slate-700 rounded-md">
        <h1 className="text-lg font-bold">Webpage</h1>
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
            {showSubmitButton &&
              (isProcessing ? (
                <Button
                  text="Processing..."
                  icon={<Clock className="animate-spin" />}
                  color="orange"
                  disabled
                />
              ) : (
                <Button
                  submit
                  icon={<Check />}
                  text="Use Reader Mode"
                  color="orange"
                />
              ))}
            <Button
              color="slate"
              icon={<Dismiss />}
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
