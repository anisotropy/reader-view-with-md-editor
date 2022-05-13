import { Article } from "./HomePage";
import makeDiff, { Char, DividedLine, Sign } from "utils/makeDiff";
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

type LineNumberProps = { sign: Sign; number: number | null };

const LineNumber = ({ sign, number }: LineNumberProps) => {
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
          "bg-red-100": sign === "-",
          "bg-green-100": sign === "+",
          "bg-gray-100": sign === null,
        }
      )}
    >
      {sign !== "+" && number}
    </div>
  );
};

type DiffRowProps = { dividedLine: DividedLine; which: keyof DividedLine };

const DiffRow = ({ dividedLine, which }: DiffRowProps) => {
  const line = dividedLine[which];

  if (which === "left" && (line.chars.length === 0 || line.sign !== "-")) {
    return null;
  }

  if (which === "right" && line.chars.length === 0) {
    return null;
  }

  return (
    <div
      role="row"
      className={classnames({
        flex: true,
        "bg-red-50": line.sign === "-",
        "bg-green-50": line.sign === "+",
      })}
    >
      <LineNumber sign={line.sign} number={dividedLine.left.number} />
      <LineNumber sign={line.sign} number={dividedLine.right.number} />
      <div role="cell" className="w-8 text-center shrink-0">
        {line.sign}
      </div>
      <DiffChars chars={line.chars} />
    </div>
  );
};

type DiffCheckerProps = { article: Article };

const DiffChecker = ({ article }: DiffCheckerProps) => {
  const diff = makeDiff(article.origin, article.readible);

  return (
    <div role="table" className="text-sm leading-relaxed font-mono">
      {diff.map((dividedLine, i) => (
        <>
          <DiffRow key={`l${i}`} dividedLine={dividedLine} which="left" />
          <DiffRow key={`r${i}`} dividedLine={dividedLine} which="right" />
        </>
      ))}
    </div>
  );
};

export default DiffChecker;
