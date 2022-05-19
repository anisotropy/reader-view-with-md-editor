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
    <div className="flex space-x-4 my-2">
      {buttons.add && (
        <Button color="red" onClick={onAdd}>
          Add
        </Button>
      )}
      {buttons.remove && (
        <Button color="green" onClick={onRemove}>
          Remove
        </Button>
      )}
      {buttons.edit && (
        <Button color="blue" onClick={onEdit}>
          Edit
        </Button>
      )}
      <Button color="slate" onClick={onClose}>
        Close
      </Button>
    </div>
  );
};

export default Menu;
