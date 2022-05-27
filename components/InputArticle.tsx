import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import Button from "./Button";
import Radio from "./Radio";
import webClip from "apis/webClip";
import classNames from "classnames";
import Backdrop from "./Backdrop";

type FormInput = {
  source: "url" | "html";
  url: string;
  html: string;
};

type InputArticleProps = {
  onChangeArticle: (article: { origin: string; readable: string }) => void;
};

const InputArticle = ({ onChangeArticle }: InputArticleProps) => {
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
      const res = await webClip({ url, html });
      onChangeArticle(res);
    } else {
      // TODO: url과 html 모두 없을 때 경고 메시지 표시
    }
  };

  const inputClassName = [
    "flex-1 p-1",
    "border border-sky-500 outline-none rounded",
    "placeholder:text-slate-300, placeholder:italic",
    "disabled:border-slate-300 disabled:text-slate-300 disabled:bg-transparent",
    "focus:bg-sky-50",
  ];

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
            />
            <input
              {...register("url", { disabled: source !== "url" })}
              autoComplete="off"
              placeholder="URL"
              className={classNames(...inputClassName)}
            />
          </div>
          <div className="flex">
            <Radio
              {...register("source")}
              value="html"
              selectedValue={source}
              className="w-8"
            />
            <textarea
              {...register("html", { disabled: source !== "html" })}
              placeholder="Write HTML code"
              className={classNames(...inputClassName, "resize-none h-36")}
            />
          </div>
          <div className="flex space-x-4">
            {showSubmitButton && <Button submit text="Use Reader Mode" />}
            <Button color="slate" text="Cancel" />
          </div>
        </form>
      </div>
    </Backdrop>
  );
};

export default InputArticle;
