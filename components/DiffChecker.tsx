import ReactDiffViewer from "react-diff-viewer";
import { Article } from "./HomePage";
import makeDiff, { Char, DividedLine, Line, Sign } from "utils/makeDiff";
import classnames from "classnames";

type DiffCharProps = { chars: Char[] };

const DiffChars = ({ chars }: DiffCharProps) => {
  return (
    <span role="cell" className="flex">
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
    </span>
  );
};

type LineNumberProps = { sign: Sign; number: number | null };

const LineNumber = ({ sign, number }: LineNumberProps) => {
  return (
    <span
      role="cell"
      className={classnames("w-10", "text-right", "pr-1.5", "text-slate-500", {
        "bg-red-100": sign === "-",
        "bg-green-100": sign === "+",
        "bg-gray-100": sign === null,
      })}
    >
      {sign !== "+" && number}
    </span>
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
    <pre
      role="row"
      className={classnames({
        flex: true,
        "bg-red-50": line.sign === "-",
        "bg-green-50": line.sign === "+",
      })}
    >
      <LineNumber sign={line.sign} number={dividedLine.left.number} />
      <LineNumber sign={line.sign} number={dividedLine.right.number} />
      <span role="cell" className="w-8 text-center">
        {line.sign}
      </span>
      <DiffChars chars={line.chars} />
    </pre>
  );
};

type DiffCheckerProps = { article: Article };

const DiffChecker = ({ article }: DiffCheckerProps) => {
  const diff = makeDiff(article.origin, article.readible);

  return (
    <>
      <div role="table" className="text-sm leading-relaxed">
        {diff.map((dividedLine, i) => (
          <>
            <DiffRow key={`l${i}`} dividedLine={dividedLine} which="left" />
            <DiffRow key={`r${i}`} dividedLine={dividedLine} which="right" />
          </>
        ))}
      </div>
      <ReactDiffViewer
        oldValue={article.origin}
        newValue={article.readible}
        splitView={false}
      />
    </>
  );
};

export default DiffChecker;
