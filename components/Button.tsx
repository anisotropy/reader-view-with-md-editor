import classNames from "classnames";

type ButtonProps = {
  text: string;
  submit?: boolean;
  color?: "blue" | "green" | "red" | "slate" | "orange";
  textSize?: "sm";
  icon?: JSX.Element;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
};

const Button = ({
  text,
  submit,
  color = "blue",
  textSize = "sm",
  icon,
  className: extraClassName,
  disabled,
  onClick,
}: ButtonProps) => {
  const className = classNames({
    "flex items-center space-x-1": true,
    "rounded border-0 leading-none text-white outline-offset-2": true,
    "bg-sky-500 hover:bg-sky-400 outline-sky-400 disabled:bg-sky-700":
      color === "blue",
    "bg-green-500 hover:bg-green-400 outline-green-400 disabled:bg-green-700":
      color === "green",
    "bg-red-500 hover:bg-red-400 outline-red-400 disabled:bg-red-700":
      color === "red",
    "bg-slate-500 hover:bg-slate-400 outline-slate-400 disabled:bg-slate-700":
      color === "slate",
    "bg-orange-500 hover:bg-orange-400 outline-orange-400 disabled:bg-orange-700":
      color === "orange",
    "text-sm h-8": textSize === "sm",
    "px-3": textSize === "sm" && !icon,
    "pl-2 pr-3": textSize === "sm" && icon,
    [extraClassName || ""]: Boolean(extraClassName),
  });

  return (
    <button
      type={submit ? "submit" : undefined}
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {icon}
      <span>{text}</span>
    </button>
  );
};

export default Button;
