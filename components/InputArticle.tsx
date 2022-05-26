import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import Button from "./Button";
import Radio from "./Radio";
import webClip from "apis/webClip";
import classNames from "classnames";

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
    <div className="flex justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-2/4 p-4 space-y-2 text-sm text-sky-700"
      >
        <div className="flex space-x-2">
          <Radio {...register("source")} value="url" selectedValue={source} />
          <input
            {...register("url", { disabled: source !== "url" })}
            placeholder="Write a web page address"
            className={classNames(...inputClassName)}
          />
        </div>
        <div className="flex space-x-2">
          <Radio {...register("source")} value="html" selectedValue={source} />
          <textarea
            {...register("html", { disabled: source !== "html" })}
            placeholder="Write an HTML document"
            className={classNames(...inputClassName, "resize-none h-36")}
          />
        </div>
        <div className="flex space-x-2 ml-8">
          {showSubmitButton && <Button submit text="Use Reader Mode" />}
          <Button color="slate" text="Cancel" />
        </div>
      </form>
    </div>
  );
};

export default InputArticle;
