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
import Menu from "./Menu";

type DiffCharProps = {
  isEditing: boolean;
  sentence: string;
  chars: Char[];
  onUpdate: (markdonw: string) => void;
  onCancel: () => void;
};

const DiffChars = ({
  isEditing,
  sentence,
  chars,
  onUpdate,
  onCancel,
}: DiffCharProps) => {
  return (
    <>
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
    </>
  );
};

// type LineNumberProps = {
//   color: "red" | "green" | "gray";
//   cursorPointer: boolean;
//   number: number | null;
//   onClick: () => void;
// };

// const LineNumber = ({
//   color,
//   cursorPointer,
//   number,
//   onClick,
// }: LineNumberProps) => {
//   return (
//     <div
//       role="cell"
//       className={classnames(
//         "w-10",
//         "text-right",
//         "pr-1.5",
//         "text-slate-500",
//         "shrink-0",
//         {
//           "bg-red-100 hover:bg-red-200": color === "red",
//           "bg-green-100 hover:bg-green-200": color === "green",
//           "bg-gray-100 hover:bg-gray-200": color === "gray",
//           "cursor-pointer": cursorPointer,
//         }
//       )}
//       onClick={onClick}
//     >
//       {number}
//     </div>
//   );
// };

type DiffRowProps = {
  line: SingleLine;
  showMenu: boolean;
  isEditing: boolean;
  onShowMenu: (lineId: number) => void;
  onCloseMenu: () => void;
  onAdd: (lineId: number) => void;
  onRemove: (lineId: number) => void;
  onEdit: (lineId: number) => void;
  onUpdate: (lineId: number, markdown: string) => void;
  onCancel: () => void;
};

const DiffRow = ({
  line,
  showMenu,
  isEditing,
  onShowMenu,
  onCloseMenu,
  onAdd,
  onRemove,
  onEdit,
  onUpdate,
  onCancel,
}: DiffRowProps) => {
  const menuButtons = {
    add: line.sign === "-",
    remove: line.sign === "+",
    edit: line.sign !== "-",
  };

  const onClickAdd = () => onAdd(line.id);
  const onClickRemove = () => onRemove(line.id);
  const onClickEdit = () => onEdit(line.id);
  const onClickUpdate = (markdown: string) => onUpdate(line.id, markdown);
  const onClickLine = () => {
    if (!showMenu && !isEditing) onShowMenu(line.id);
  };

  // const numberProps = {
  //   color:
  //     line.sign === "-"
  //       ? "red"
  //       : line.sign === "+"
  //       ? "green"
  //       : ("gray" as "red" | "green" | "gray"),
  //   cursorPointer: true,
  // };

  return (
    <>
      <div
        role="row"
        className={classnames({
          "flex cursor-pointer pr-2": true,
          "bg-red-50 hover:bg-red-100": line.sign === "-",
          "bg-green-50 hover:bg-green-100": line.sign === "+",
          "bg-white hover:bg-gray-100": line.sign === null,
        })}
        onClick={onClickLine}
      >
        <div role="cell" className="w-8 text-center shrink-0">
          {line.sign}
        </div>
        <div role="cell" className="grow whitespace-pre-wrap break-all">
          <DiffChars
            isEditing={isEditing}
            sentence={line.sentence}
            chars={line.chars}
            onUpdate={onClickUpdate}
            onCancel={onCancel}
          />
          {showMenu && (
            <Menu
              buttons={menuButtons}
              onAdd={onClickAdd}
              onRemove={onClickRemove}
              onEdit={onClickEdit}
              onClose={onCloseMenu}
            />
          )}
        </div>
      </div>
    </>
  );
};

type DiffCheckerProps = {
  oldDoc: string;
  newDoc: string;
  onChangeArticle: (readibleArticle: string) => void;
};

const DiffChecker = ({ oldDoc, newDoc, onChangeArticle }: DiffCheckerProps) => {
  const [theLineId, setTheLineId] = useState<number | null>(null);
  const [lineIdToEdit, setLineIdToEdit] = useState<number | null>(null);
  const diff = makeDiff(oldDoc, newDoc);
  const lines = diffWithoutSplit(diff);

  const onShowMenu = (lineId: number) => {
    setTheLineId(lineId);
    setLineIdToEdit(null);
  };

  const onCloseMenu = () => {
    setTheLineId(null);
    setLineIdToEdit(null);
  };

  const onAdd = (lineId: number) => {
    const newArticle = addSentence(diff, lines[lineId]);
    onChangeArticle(newArticle);
    setTheLineId(null);
    setLineIdToEdit(null);
  };

  const onRemove = (lineId: number) => {
    const newArticle = removeSentence(diff, lines[lineId]);
    onChangeArticle(newArticle);
    setTheLineId(null);
    setLineIdToEdit(null);
  };

  const onEdit = (lineId: number) => {
    setLineIdToEdit(lineId);
  };

  const onUpdate = (lineId: number, markdown: string) => {
    const newArticle = updateSentece(diff, lines[lineId], markdown);
    onChangeArticle(newArticle);
    setTheLineId(null);
    setLineIdToEdit(null);
  };

  const onCancel = () => {
    setLineIdToEdit(null);
  };

  if (!oldDoc && !newDoc) return null;
  return (
    <div className="text-slate-700 leading-relaxed">
      {lines.map((line) => (
        <DiffRow
          key={line.id}
          line={line}
          showMenu={line.id === theLineId && lineIdToEdit === null}
          isEditing={line.id === lineIdToEdit}
          onShowMenu={onShowMenu}
          onCloseMenu={onCloseMenu}
          onAdd={onAdd}
          onRemove={onRemove}
          onEdit={onEdit}
          onUpdate={onUpdate}
          onCancel={onCancel}
        />
      ))}
    </div>
  );
};

export default DiffChecker;
