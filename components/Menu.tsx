import Button from "./Button";

type MenuProps = {
  buttons: { add: boolean; remove: boolean; edit: boolean };
  onAdd: () => void;
  onRemove: () => void;
  onEdit: () => void;
  onClose: () => void;
};

const Menu = ({ buttons, onAdd, onRemove, onEdit, onClose }: MenuProps) => {
  return (
    <div className="absolute top-0 left-20 flex space-x-2 p-2 bg-white rounded border-0 drop-shadow-md">
      {buttons.add && (
        <Button color="red" onClick={onAdd}>
          추가
        </Button>
      )}
      {buttons.remove && (
        <Button color="green" onClick={onRemove}>
          삭제
        </Button>
      )}
      {buttons.edit && (
        <Button color="blue" onClick={onEdit}>
          수정
        </Button>
      )}
      <Button color="slate" onClick={onClose}>
        닫기
      </Button>
    </div>
  );
};

export default Menu;
