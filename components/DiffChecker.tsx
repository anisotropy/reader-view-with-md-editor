import makeDiff, {
  addSentence,
  removeSentence,
  Char,
  diffWithoutSplit,
  SingleLine,
} from "utils/makeDiff";
import classnames from "classnames";

type DiffCharProps = {
  chars: Char[];
  cursorPointer: boolean;
  onClick: () => void;
};

const DiffChars = ({ chars, cursorPointer, onClick }: DiffCharProps) => {
  return (
    <div
      role="cell"
      className={classnames("grow", "whitespace-pre-wrap", {
        "cursor-pointer": cursorPointer,
      })}
      onClick={onClick}
    >
      {chars.map((char, i) => (
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
      ))}
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
  onAdd: (line: SingleLine) => void;
  onRemove: (line: SingleLine) => void;
  onEdit: (line: SingleLine) => void;
};

const DiffRow = ({ line, onAdd, onRemove, onEdit }: DiffRowProps) => {
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
        chars={line.chars}
        cursorPointer={line.sign !== "-"}
        onClick={onClickSentence}
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
  if (!oldDoc && !newDoc) return null;

  const diff = makeDiff(oldDoc, newDoc);
  const lines = diffWithoutSplit(diff);

  const onAdd = (line: SingleLine) => {
    const newSentece = addSentence(diff, line);
    onChangeArticle(newSentece);
  };

  const onRemove = (line: SingleLine) => {
    const newSentece = removeSentence(diff, line);
    onChangeArticle(newSentece);
  };

  const onEdit = () => {
    console.log("onEdit");
  };

  return (
    <div role="table" className="text-sm leading-relaxed font-mono">
      {lines.map((line, i) => (
        <DiffRow
          key={i}
          line={line}
          onAdd={onAdd}
          onRemove={onRemove}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

export default DiffChecker;
