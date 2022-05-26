import React, { useState } from "react";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import Button from "./Button";
import Radio from "./Radio";

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

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="flex">
        <Radio {...register("source")} value="url" selectedValue={source} />
        <input
          className="border"
          {...register("url", { disabled: source !== "url" })}
          placeholder="Input URL"
        />
      </div>
      <div className="flex">
        <Radio {...register("source")} value="html" selectedValue={source} />
        <textarea
          {...register("html", { disabled: source !== "html" })}
          placeholder="Input HTML"
        />
      </div>

      <Button submit text="submit" />
    </form>
  );
};

export default InputArticle;
