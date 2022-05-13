import { Article } from "./HomePage";
import makeDiff, { addSentece, Char, DividedLine, Sign } from "utils/makeDiff";
import classnames from "classnames";
import { Fragment } from "react";

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
  onClick?: () => void;
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
          "bg-green-100 hover:bg-green-100": sign === "+",
          "bg-gray-100 hover:bg-gray-200": sign === null,
          "cursor-pointer": Boolean(onClick),
        }
      )}
      onClick={onClick}
    >
      {sign !== "+" && number}
    </div>
  );
};

type DiffRowProps = {
  dividedLine: DividedLine;
  which: keyof DividedLine;
  onAdd?: (dividedLine: DividedLine) => void;
};

const DiffRow = ({ dividedLine, which, onAdd }: DiffRowProps) => {
  const line = dividedLine[which];

  if (which === "left" && (line.chars.length === 0 || line.sign !== "-")) {
    return null;
  }

  if (which === "right" && line.chars.length === 0) {
    return null;
  }

  const onClickNumber = onAdd
    ? () => {
        onAdd(dividedLine);
      }
    : undefined;

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
        number={dividedLine.left.number}
        onClick={onClickNumber}
      />
      <LineNumber sign={line.sign} number={dividedLine.right.number} />
      <div role="cell" className="w-8 text-center shrink-0">
        {line.sign}
      </div>
      <DiffChars chars={line.chars} />
    </div>
  );
};

type DiffCheckerProps = {
  article: Article;
  onChangeArticle: (readibleArticle: string) => void;
};

const DiffChecker = ({ article, onChangeArticle }: DiffCheckerProps) => {
  if (!article.origin && !article.readible) return null;

  const diff = makeDiff(article.origin, article.readible);

  const onAdd = ({ left, right }: DividedLine) => {
    if (left.sentence === null) return;
    const number = right.number || right.prevNumber || 0;
    const newSentece = addSentece(diff, left.sentence, number);
    onChangeArticle(newSentece);
  };

  return (
    <div role="table" className="text-sm leading-relaxed font-mono">
      {diff.map((dividedLine, i) => (
        <Fragment key={i}>
          <DiffRow dividedLine={dividedLine} which="left" onAdd={onAdd} />
          <DiffRow dividedLine={dividedLine} which="right" />
        </Fragment>
      ))}
    </div>
  );
};

export default DiffChecker;
