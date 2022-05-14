import makeDiff, {
  addSentence,
  Char,
  diffWithoutSplit,
  Sign,
  SingleLine,
} from "utils/makeDiff";
import classnames from "classnames";

type DiffCharProps = { chars: Char[] };

const DiffChars = ({ chars }: DiffCharProps) => {
  return (
    <div role="cell" className="grow whitespace-pre-wrap">
      {chars.map((char, i) => (
        <span
          key={i}
          role="cell"
          className={
            char.removed ? "bg-red-200" : char.added ? "bg-green-200" : ""
          }
        >
          {char.value}
        </span>
      ))}
    </div>
  );
};

type LineNumberProps = {
  sign: Sign;
  number: number | null;
  onClick: () => void;
};

const LineNumber = ({ sign, number, onClick }: LineNumberProps) => {
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
          "bg-red-100 hover:bg-red-200": sign === "-",
          "bg-green-100 hover:bg-green-200": sign === "+",
          "bg-gray-100 hover:bg-gray-200": sign === null,
          "cursor-pointer": sign !== null,
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
};

const DiffRow = ({ line, onAdd }: DiffRowProps) => {
  const onClickNumber = () => {
    if (line.sign === "-") onAdd(line);
  };

  return (
    <div
      role="row"
      className={classnames({
        flex: true,
        "bg-red-50": line.sign === "-",
        "bg-green-50": line.sign === "+",
      })}
    >
      <LineNumber
        sign={line.sign}
        number={line.showLeftNumber ? line.leftNumber : null}
        onClick={onClickNumber}
      />
      <LineNumber
        sign={line.sign}
        number={line.showRightNumber ? line.rightNumber : null}
        onClick={onClickNumber}
      />
      <div role="cell" className="w-8 text-center shrink-0">
        {line.sign}
      </div>
      <DiffChars chars={line.chars} />
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

  return (
    <div role="table" className="text-sm leading-relaxed font-mono">
      {lines.map((line, i) => (
        <DiffRow key={i} line={line} onAdd={onAdd} />
      ))}
    </div>
  );
};

export default DiffChecker;
