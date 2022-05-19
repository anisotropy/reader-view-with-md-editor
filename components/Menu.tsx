import Button from "./Button";
import Add from "./icons/Add";
import Remove from "./icons/Remove";

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
        <Button color="red" onClick={onAdd} icon={<Add />} text="Add" />
      )}
      {buttons.remove && (
        <Button
          color="green"
          onClick={onRemove}
          icon={<Remove />}
          text="Remove"
        />
      )}
      {buttons.edit && <Button color="blue" onClick={onEdit} text="Edit" />}
      <Button color="slate" onClick={onClose} text="Close" />
    </div>
  );
};

export default Menu;
