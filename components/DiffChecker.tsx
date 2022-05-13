import ReactDiffViewer from "react-diff-viewer";
import { Article } from "./HomePage";
import makeDiff from "utils/makeDiff";

type DiffCheckerProps = { article: Article };

const DiffChecker = ({ article }: DiffCheckerProps) => {
  // article.origin = `
  //   zbb
  //   aaa
  //   aaa
  // `;
  // article.readible = `
  //   zzz
  //   aaa
  //   aaa
  // `;

  article.origin = `
       zbb
    kkk
    ddd
    aaa
    ttt
  `;
  article.readible = `
    zzz
    aaa
    ttt
    jjj
  `;

  const lines = makeDiff(article.origin, article.readible);

  return (
    <>
      <div>
        {lines.map((line, i) => (
          <div key={i}>
            <pre>
              L{i} {line.left.number}
              {line.left.sign}
              {JSON.stringify(line.left.chars)}
            </pre>
            <pre>
              R{i} {line.right.number}
              {line.right.sign}
              {JSON.stringify(line.right.chars)}
            </pre>
            <br />
          </div>
        ))}
      </div>
      <ReactDiffViewer
        oldValue={article.origin}
        newValue={article.readible}
        splitView
      />
    </>
  );
};

export default DiffChecker;
