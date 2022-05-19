import React, { useCallback, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Button from "./Button";

type FormInput = {
  markdown: string;
};

type MdEditorProps = {
  initialValue: string;
  onUpdate: (markdown: string) => void;
  onCancel: () => void;
};

const MdEditor = ({ initialValue, onUpdate, onCancel }: MdEditorProps) => {
  const { register, handleSubmit } = useForm<FormInput>();

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    onUpdate(data.markdown);
  };

  const changeMdHeight = useCallback(
    (
      event:
        | React.ChangeEvent<HTMLTextAreaElement>
        | React.FocusEvent<HTMLTextAreaElement, Element>
    ) => {
      event.target.style.height = "0";
      event.target.style.height = `${event.target.scrollHeight}px`;
    },
    []
  );

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <textarea
        {...register("markdown", { onChange: changeMdHeight })}
        onFocus={changeMdHeight}
        autoFocus
        defaultValue={initialValue}
        className="p-0 outline-none bg-transparent w-full resize-none"
      />
      <div style={{ height: "1px" }} />
      <div className="flex space-x-4 mb-2">
        <Button submit color="blue">
          Update
        </Button>
        <Button color="slate" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default MdEditor;
