import Button from "./Button";
import Add from "./icons/Add";
import Dismiss from "./icons/Dismiss";
import Edit from "./icons/Edit";
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
      {buttons.add && <Button onClick={onAdd} Icon={Add} text="Add" />}
      {buttons.remove && (
        <Button onClick={onRemove} Icon={Remove} text="Remove" />
      )}
      {buttons.edit && <Button onClick={onEdit} Icon={Edit} text="Edit" />}
      <Button border onClick={onClose} Icon={Dismiss} text="Close" />
    </div>
  );
};

export default Menu;
