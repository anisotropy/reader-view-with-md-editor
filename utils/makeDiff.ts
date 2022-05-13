import { diffLines, diffChars, Change as DiffChange } from "diff";

export type Char = DiffChange;

export type Sign = "+" | "-" | null;

export type Line = {
  number: number | null;
  prevNumber: number | null;
  sign: Sign;
  chars: DiffChange[];
  sentence: string | null;
};

export type DividedLine = { left: Line; right: Line };

export type Lines = DividedLine[];

const divideChanges = (changes: DiffChange[]) => {
  const left: (DiffChange | null)[] = [];
  const right: (DiffChange | null)[] = [];
  changes.forEach((change) => {
    if (change.removed) {
      if (left[left.length - 1] === null) {
        left[left.length - 1] = change;
      } else {
        left.push(change);
        right.push(null);
      }
    } else if (change.added) {
      if (right[right.length - 1] === null) {
        right[right.length - 1] = change;
      } else {
        left.push(null);
        right.push(change);
      }
    } else {
      left.push(change);
      right.push(change);
    }
  });
  return { left, right };
};

const splitValue = (change: DiffChange | null, length: number) => {
  const sentences: (string | null)[] = [];
  const temp = change?.value.split("\n").slice(0, change?.count) || [];
  for (let i = 0; i < length; i++) {
    sentences.push(temp[i] === undefined ? null : temp[i]);
  }
  return sentences;
};

const makeLine = (
  diffChange: DiffChange | null,
  lineNumber: number,
  chars: DiffChange[],
  sentence: string | null
): Line => {
  const { removed, added } = diffChange || {};
  const newLineNumber = chars.length ? lineNumber + 1 : lineNumber;
  const number = chars.length ? newLineNumber : null;
  return {
    number,
    prevNumber: chars.length ? null : lineNumber,
    sign: chars.length ? (removed ? "-" : added ? "+" : null) : null,
    chars,
    sentence,
  };
};

const extractLastNumbers = (lines: Lines) => {
  const leftNumber =
    lines.length > 0
      ? lines[lines.length - 1].left.number ||
        lines[lines.length - 1].left.prevNumber ||
        0
      : 0;
  const rightNumber =
    lines.length > 0
      ? lines[lines.length - 1].right.number ||
        lines[lines.length - 1].right.prevNumber ||
        0
      : 0;
  return { leftNumber, rightNumber };
};

const makeChars = (
  leftSentence: string | null,
  rightSentence: string | null
) => {
  if (leftSentence === null && rightSentence !== null) {
    return {
      leftChars: [],
      rightChars: [{ added: true, value: rightSentence }],
    };
  } else if (leftSentence !== null && rightSentence === null) {
    return {
      leftChars: [{ removed: true, value: leftSentence }],
      rightChars: [],
    };
  } else if (leftSentence === null && rightSentence === null) {
    return { leftChars: [], rightChars: [] };
  }

  const changes = diffChars(leftSentence || "", rightSentence || "");
  const leftChars: DiffChange[] = [];
  const rightChars: DiffChange[] = [];
  changes.forEach((change) => {
    if (change.removed) {
      leftChars.push(change);
    } else if (change.added) {
      rightChars.push(change);
    } else {
      leftChars.push(change);
      rightChars.push(change);
    }
  });

  if (leftChars.length === 1) leftChars[0].removed = undefined;
  if (rightChars.length === 1) rightChars[0].added = undefined;

  return { leftChars, rightChars };
};

const appendLlines = (
  globalLines: Lines,
  left: DiffChange | null,
  right: DiffChange | null
) => {
  const length = Math.max(left?.count || 0, right?.count || 0);
  const leftSentences = splitValue(left, length);
  const rightSentences = splitValue(right, length);

  const lines: Lines = [];
  let { leftNumber, rightNumber } = extractLastNumbers(globalLines);
  for (let i = 0; i < length; i++) {
    const { leftChars, rightChars } = makeChars(
      leftSentences[i],
      rightSentences[i]
    );
    const leftLine = makeLine(left, leftNumber, leftChars, leftSentences[i]);
    const rightLine = makeLine(
      right,
      rightNumber,
      rightChars,
      rightSentences[i]
    );
    leftNumber = leftLine.number || leftLine.prevNumber || leftNumber;
    rightNumber = rightLine.number || rightLine.prevNumber || rightNumber;
    lines.push({ left: leftLine, right: rightLine });
  }

  return globalLines.concat(lines);
};

const groupsToLines = (
  left: (DiffChange | null)[],
  right: (DiffChange | null)[]
) => {
  const length = Math.max(left.length, right.length);
  let lines: Lines = [];
  for (let i = 0; i < length; i++) {
    lines = appendLlines(lines, left[i] || null, right[i] || null);
  }
  return lines;
};

const preprocess = (str: string) => {
  return str.trim() + "\n";
};

const makeDiff = (origin: string, readible: string) => {
  const changes = diffLines(preprocess(origin), preprocess(readible));
  const { left, right } = divideChanges(changes);
  const lines = groupsToLines(left, right);
  return lines;
};

export const addSentece = (
  diff: Lines,
  sentenceToAdd: string,
  lineNumber: number
) => {
  let newSentence = "";
  let isAdded = false;
  diff.forEach((dividedLine) => {
    const { right } = dividedLine;
    if (right.number && lineNumber === right.number - 1) {
      newSentence += sentenceToAdd + "\n";
      isAdded = true;
    }
    if (right.sentence !== null) {
      newSentence += right.sentence + "\n";
    }
  });
  if (!isAdded) {
    newSentence += sentenceToAdd + "\n";
  }

  return newSentence;
};

export default makeDiff;
