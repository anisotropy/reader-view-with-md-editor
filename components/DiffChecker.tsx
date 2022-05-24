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
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  onChangeSize: (line: SingleLine, element: HTMLDivElement) => void;
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
  onChangeSize,
}: DiffRowProps) => {
  const element = useRef<HTMLDivElement>(null);
  const menuButtons = {
    add: line.sign === "-",
    remove: line.sign !== "-",
    edit: line.sign !== "-",
  };

  const onClickAdd = () => onAdd(line.id);
  const onClickRemove = () => onRemove(line.id);
  const onClickEdit = () => onEdit(line.id);
  const onClickUpdate = (markdown: string) => onUpdate(line.id, markdown);
  const onClickLine = () => {
    if (!showMenu && !isEditing) onShowMenu(line.id);
  };

  useEffect(() => {
    if (!element?.current) return;
    onChangeSize(line, element.current);
  }, [
    line,
    onChangeSize,
    element?.current?.offsetTop,
    element?.current?.offsetHeight,
  ]);

  return (
    <div
      role="row"
      ref={element}
      className={classnames({
        "flex cursor-pointer pr-2": true,
        "bg-red-50 hover:bg-red-100": line.sign === "-",
        "bg-green-50 hover:bg-green-100": line.sign === "+",
        "bg-white hover:bg-gray-100": line.sign === null,
      })}
      onClick={onClickLine}
    >
      <div role="cell" className="w-8 whitespace-pre-wrap text-center shrink-0">
        {line.sign || " "}
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
  );
};

type DiffCheckerProps = {
  oldDoc: string;
  newDoc: string;
  onChangeArticle: (readibleArticle: string) => void;
  onChangeLineSize: (lineId: number, top: number, heighr: number) => void;
};

const DiffChecker = ({
  oldDoc,
  newDoc,
  onChangeArticle,
  onChangeLineSize,
}: DiffCheckerProps) => {
  const [theLineId, setTheLineId] = useState<number | null>(null);
  const [lineIdToEdit, setLineIdToEdit] = useState<number | null>(null);

  const diff = useMemo(() => makeDiff(oldDoc, newDoc), [oldDoc, newDoc]);
  const lines = useMemo(() => diffWithoutSplit(diff), [diff]);

  const onShowMenu = useCallback((lineId: number) => {
    setTheLineId(lineId);
    setLineIdToEdit(null);
  }, []);

  const onCloseMenu = useCallback(() => {
    setTheLineId(null);
    setLineIdToEdit(null);
  }, []);

  const onAdd = useCallback(
    (lineId: number) => {
      const newArticle = addSentence(diff, lines[lineId]);
      onChangeArticle(newArticle);
      setTheLineId(null);
      setLineIdToEdit(null);
    },
    [diff, lines, onChangeArticle]
  );

  const onRemove = useCallback(
    (lineId: number) => {
      const newArticle = removeSentence(diff, lines[lineId]);
      onChangeArticle(newArticle);
      setTheLineId(null);
      setLineIdToEdit(null);
    },
    [diff, lines, onChangeArticle]
  );

  const onEdit = useCallback((lineId: number) => {
    setLineIdToEdit(lineId);
  }, []);

  const onUpdate = useCallback(
    (lineId: number, markdown: string) => {
      const newArticle = updateSentece(diff, lines[lineId], markdown);
      onChangeArticle(newArticle);
      setTheLineId(null);
      setLineIdToEdit(null);
    },
    [diff, lines, onChangeArticle]
  );

  const onCancel = useCallback(() => {
    setLineIdToEdit(null);
  }, []);

  const onChangeSize = useCallback(
    (line: SingleLine, element: HTMLDivElement) => {
      if (!line.showRightNumber) return;
      onChangeLineSize(line.id, element.offsetTop, element.offsetHeight);
    },
    [onChangeLineSize]
  );

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
          onChangeSize={onChangeSize}
        />
      ))}
    </div>
  );
};

export default DiffChecker;
