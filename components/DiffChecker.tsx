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
import React, { useEffect, useMemo, useRef, useState } from "react";
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
  onMount: (line: SingleLine, element: HTMLDivElement) => void;
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
    if (element?.current) {
      onMount(line, element.current);
    }
  }, [line, element, onMount]);

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
  wrapperHeight?: number;
  editorScrollTop: number | null;
  oldDoc: string;
  newDoc: string;
  onChangeArticle: (readibleArticle: string) => void;
  onChangeEditorScrollTop: (viewerScrollTop: number) => void;
  onMountLine: (lineId: number, top: number, heighr: number) => void;
};

const DiffChecker = ({
  wrapperHeight,
  editorScrollTop,
  oldDoc,
  newDoc,
  onChangeArticle,
  onChangeEditorScrollTop,
  onMountLine,
}: DiffCheckerProps) => {
  const [theLineId, setTheLineId] = useState<number | null>(null);
  const [lineIdToEdit, setLineIdToEdit] = useState<number | null>(null);
  const wrapperEl = useRef<HTMLDivElement>(null);
  const diff = makeDiff(oldDoc, newDoc);
  const lines = diffWithoutSplit(diff);

  const tops = lines.map(() => ({
    top: 0,
    realTop: 0,
    height: 0,
    rightSide: false,
  }));
  let countMountEl = 0;

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

  // Scroll Sync ////

  const onMount = (line: SingleLine, element: HTMLDivElement) => {
    tops[line.id] = {
      top: -1,
      realTop: line.showRightNumber ? element.offsetTop : -1,
      height: line.showRightNumber ? element.offsetHeight : 0,
      rightSide: line.showRightNumber,
    };
    countMountEl++;

    if (!line.showRightNumber) return;
    onMountLine(line.id, element.offsetTop, element.offsetHeight);
  };

  useEffect(() => {
    if (countMountEl < tops.length) return;
    let lastTop = null;
    for (let i = 0; i < tops.length; i++) {
      if (!tops[i].rightSide) continue;
      tops[i].top = lastTop ? lastTop.top + lastTop.height : 0;
      lastTop = tops[i];
    }
  }, [tops, countMountEl]);

  useEffect(() => {
    if (!wrapperEl?.current || editorScrollTop === null) return;
    const top = editorScrollTop + wrapperEl.current.offsetTop;
    const theTopValues = tops.find(
      (t) => t.realTop <= top && top < t.realTop + t.height
    );
    if (!theTopValues) {
      if (tops[0].realTop > top) onChangeEditorScrollTop(0);
    } else {
      const height = tops.reduce(
        (height, t) => height + (t.rightSide ? t.height : 0),
        0
      );
      const scrollRatio =
        (theTopValues.top + top - theTopValues.realTop) /
        (height - (wrapperHeight || 0));
      onChangeEditorScrollTop(scrollRatio);
    }
  }, [
    editorScrollTop,
    wrapperEl,
    tops,
    onChangeEditorScrollTop,
    wrapperHeight,
  ]);

  //// Scroll Sync

  if (!oldDoc && !newDoc) return null;
  return (
    <div ref={wrapperEl} className="text-slate-700 leading-relaxed">
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
