import makeDiff, {
  addSentence,
  removeSentence,
  Char,
  diffWithoutSplit,
  SingleLine,
  updateSentece,
  Sign,
} from "utils/makeDiff";
import classNames from "classnames";
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
  sign: Sign;
  onUpdate: (markdonw: string) => void;
  onCancel: () => void;
};

const DiffChars = ({
  isEditing,
  sentence,
  chars,
  sign,
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
            className={classNames({
              "m-bg-red m-text-white font-bold line-through px-px mx-px":
                char.removed,
              "m-bg-green m-text-white px-px mx-px": char.added,
              "line-through": sign === "-",
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
  onMount: (line: SingleLine, element: React.RefObject<HTMLDivElement>) => void;
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
  onMount,
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
    if (element) onMount(line, element);
  }, [line, element, onMount]);

  return (
    <div
      role="row"
      ref={element}
      className={classNames({
        "flex cursor-pointer pr-2 group relative": true,
        "m-text-red": line.sign === "-",
        "m-text-green": line.sign === "+",
      })}
      onClick={onClickLine}
    >
      <div
        className={classNames({
          "absolute top-0 left-0 h-full w-2 ": true,
          "group-hover:m-bg-slate": !isEditing,
          "group-hover:m-bg-sky": isEditing,
        })}
      ></div>
      <div role="cell" className="w-8 whitespace-pre-wrap text-center shrink-0">
        {line.sign || " "}
      </div>
      <div role="cell" className="grow whitespace-pre-wrap break-all">
        <DiffChars
          isEditing={isEditing}
          sentence={line.sentence}
          chars={line.chars}
          sign={line.sign}
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
  onChangeArticle: (readableArticle: string) => void;
  onMountLineEl: (
    index: number,
    element: React.RefObject<HTMLDivElement>
  ) => void;
};

const DiffChecker = ({
  oldDoc,
  newDoc,
  onChangeArticle,
  onMountLineEl,
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

  const onMount = useCallback(
    (line: SingleLine, element: React.RefObject<HTMLDivElement>) => {
      if (!line.showRightNumber) return;
      onMountLineEl(line.rightNumber - 1, element);
    },
    [onMountLineEl]
  );

  if (!oldDoc && !newDoc) return null;
  return (
    <div className="m-text-slate leading-relaxed">
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
          onMount={onMount}
        />
      ))}
    </div>
  );
};

export default DiffChecker;
