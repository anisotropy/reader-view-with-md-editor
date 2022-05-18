import makeDiff, {
  addSentence,
  removeSentence,
  Char,
  diffWithoutSplit,
  SingleLine,
  updateSentece,
} from "utils/makeDiff";
import classnames from "classnames";
import MdEditor from "./MdEditor";
import { useState } from "react";

type DiffCharProps = {
  isEditing: boolean;
  sentence: string;
  chars: Char[];
  cursorPointer: boolean;
  onClick: () => void;
  onUpdate: (markdonw: string) => void;
  onCancel: () => void;
};

const DiffChars = ({
  isEditing,
  sentence,
  chars,
  cursorPointer,
  onUpdate,
  onClick,
  onCancel,
}: DiffCharProps) => {
  return (
    <div
      role="cell"
      className={classnames("grow", "whitespace-pre-wrap", {
        "cursor-pointer": cursorPointer,
      })}
      onClick={onClick}
    >
      {isEditing ? (
        <MdEditor
          initialValue={sentence}
          onUpdate={onUpdate}
          onCancel={onCancel}
        />
      ) : (
        chars.map((char, i) => (
          <span
            key={i}
            role="cell"
            className={classnames({
              "bg-red-200": char.removed,
              "bg-green-200": char.added,
            })}
          >
            {char.value}
          </span>
        ))
      )}
    </div>
  );
};

type LineNumberProps = {
  color: "red" | "green" | "gray";
  cursorPointer: boolean;
  number: number | null;
  onClick: () => void;
};

const LineNumber = ({
  color,
  cursorPointer,
  number,
  onClick,
}: LineNumberProps) => {
  return (
    <div
      role="cell"
      className={classnames(
        "w-10",
        "text-right",
        "pr-1.5",
        "text-slate-500",
        "shrink-0",
        {
          "bg-red-100 hover:bg-red-200": color === "red",
          "bg-green-100 hover:bg-green-200": color === "green",
          "bg-gray-100 hover:bg-gray-200": color === "gray",
          "cursor-pointer": cursorPointer,
        }
      )}
      onClick={onClick}
    >
      {number}
    </div>
  );
};

type DiffRowProps = {
  line: SingleLine;
  isEditing: boolean;
  onAdd: (line: SingleLine) => void;
  onRemove: (line: SingleLine) => void;
  onEdit: (line: SingleLine) => void;
  onUpdate: (markdown: string) => void;
  onCancel: () => void;
};

const DiffRow = ({
  line,
  isEditing,
  onAdd,
  onRemove,
  onEdit,
  onUpdate,
  onCancel,
}: DiffRowProps) => {
  const onClickNumber = () => {
    if (line.sign === "-") onAdd(line);
    if (line.sign === "+") onRemove(line);
  };

  const onClickSentence = () => {
    if (line.sign !== "-") onEdit(line);
  };

  const numberProps = {
    color:
      line.sign === "-"
        ? "red"
        : line.sign === "+"
        ? "green"
        : ("gray" as "red" | "green" | "gray"),
    cursorPointer: line.sign !== null,
  };

  return (
    <div
      role="row"
      className={classnames({
        flex: true,
        "bg-red-50 hover:bg-red-100": line.sign === "-",
        "bg-green-50 hover:bg-green-100": line.sign === "+",
        "bg-white hover:bg-gray-100": line.sign === null,
      })}
    >
      <LineNumber
        {...numberProps}
        number={line.showLeftNumber ? line.leftNumber : null}
        onClick={onClickNumber}
      />
      <LineNumber
        {...numberProps}
        number={line.showRightNumber ? line.rightNumber : null}
        onClick={onClickNumber}
      />
      <div role="cell" className="w-8 text-center shrink-0">
        {line.sign}
      </div>
      <DiffChars
        isEditing={isEditing}
        sentence={line.sentence}
        chars={line.chars}
        cursorPointer={line.sign !== "-"}
        onClick={onClickSentence}
        onUpdate={onUpdate}
        onCancel={onCancel}
      />
    </div>
  );
};

type DiffCheckerProps = {
  oldDoc: string;
  newDoc: string;
  onChangeArticle: (readibleArticle: string) => void;
};

const DiffChecker = ({ oldDoc, newDoc, onChangeArticle }: DiffCheckerProps) => {
  const [numberToEdit, setNumberToEdit] = useState<number | null>(null);
  const diff = makeDiff(oldDoc, newDoc);
  const lines = diffWithoutSplit(diff);

  const onAdd = (line: SingleLine) => {
    const newArticle = addSentence(diff, line);
    onChangeArticle(newArticle);
  };

  const onRemove = (line: SingleLine) => {
    const newArticle = removeSentence(diff, line);
    onChangeArticle(newArticle);
  };

  const onEdit = (line: SingleLine) => {
    setNumberToEdit(line.rightNumber);
  };

  const onUpdate = (markdown: string) => {
    if (numberToEdit === null) return;
    const newArticle = updateSentece(diff, markdown, numberToEdit);
    onChangeArticle(newArticle);
    setNumberToEdit(null);
  };

  const onCancel = () => {
    setNumberToEdit(null);
  };

  if (!oldDoc && !newDoc) return null;
  return (
    <>
      <div role="table" className="text-sm leading-relaxed">
        {lines.map((line, i) => (
          <DiffRow
            key={i}
            line={line}
            isEditing={
              line.rightNumber === numberToEdit && line.showRightNumber
            }
            onAdd={onAdd}
            onRemove={onRemove}
            onEdit={onEdit}
            onUpdate={onUpdate}
            onCancel={onCancel}
          />
        ))}
      </div>
    </>
  );
};

export default DiffChecker;
