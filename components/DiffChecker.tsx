import { Article } from "./HomePage";
import makeDiff, {
  addSentece,
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
};

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
        "cursor-pointer",
        {
          "bg-red-100 hover:bg-red-200": sign === "-",
          "bg-green-100 hover:bg-green-200": sign === "+",
          "bg-gray-100 hover:bg-gray-200": sign === null,
        }
      )}
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
  const onClick = () => {
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
      onClick={onClick}
    >
      <LineNumber sign={line.sign} number={line.leftNumber} />
      <LineNumber sign={line.sign} number={line.rightNumber} />
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
  const lines = diffWithoutSplit(diff);

  const onAdd = (line: SingleLine) => {
    if (line.sentence === null) return;
    const number = line.rightNumber || line.rightPrevNumber;
    const newSentece = addSentece(diff, line.sentence, number);
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
