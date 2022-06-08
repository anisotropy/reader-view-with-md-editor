import React from "react";
import { UseFormRegister } from "react-hook-form";
import Button from "./Button";
import Radio from "./Radio";
import classNames from "classnames";
import Backdrop from "./Backdrop";
import Dismiss from "./icons/Dismiss";
import DocOnePage from "./icons/DocOnePage";
import MakeReadableButton from "./MakeReadableButton";
import { FormInput } from "containers/InputArticle";

type InputArticlePresenerProps = {
  source: FormInput["source"];
  formData: FormInput | null;
  isProcessing: boolean;
  canSubmit: boolean;
  register: UseFormRegister<FormInput>;
  onClose: () => void;
  onFinshMakeReadable: (
    article: { origin: string; readable: string } | null
  ) => void;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
};

const InputArticlePresener = React.memo(
  ({
    isProcessing,
    source,
    formData,
    canSubmit,
    register,
    onFinshMakeReadable,
    onClose,
    onSubmit,
  }: InputArticlePresenerProps) => {
    const radioProps = (theSource: FormInput["source"]) => ({
      value: theSource,
      selectedValue: source,
      className: "w-8",
      disabled: isProcessing,
    });

    const inputProps = (theSource: FormInput["source"]) => ({
      autoComplete: "off",
      placeholder: theSource === "url" ? "URL" : "Put HTML code",
      className: classNames(
        "flex-1 p-1 border outline-none placeholder:m-text-gray m-bg-white disabled:m-text-gray",
        theSource === "html" && "resize-none h-36",
        theSource === source
          ? "m-border-slate m-text-black"
          : "border-transparent"
      ),
    });

    return (
      <Backdrop>
        <div className="w-full p-4 max-w-2xl m-bg-white m-text-slate rounded-md">
          <h1 className="flex text-lg items-center space-x-1">
            <DocOnePage className="w-6 fill-current" /> <span>Webpage</span>
          </h1>
          <form onSubmit={onSubmit} className="mt-4 w-full space-y-4 text-sm">
            <div className="flex group">
              <Radio {...register("source")} {...radioProps("url")} />
              <input {...register("url")} {...inputProps("url")} />
            </div>
            <div className="flex">
              <Radio {...register("source")} {...radioProps("html")} />
              <textarea {...register("html")} {...inputProps("html")} />
            </div>
            <div className="flex space-x-4">
              <MakeReadableButton
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
  }
);

InputArticlePresener.displayName = "InputArticlePresenter";

export default InputArticlePresener;
