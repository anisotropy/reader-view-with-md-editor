import classNames from "classnames";

type ButtonProps = {
  submit?: boolean;
  color?: "blue" | "green" | "red" | "slate";
  textSize?: "sm";
  icon?: JSX.Element;
  text: string;
  onClick?: () => void;
};

const Button = ({
  submit,
  color = "blue",
  textSize = "sm",
  icon,
  text,
  onClick,
}: ButtonProps) => {
  const className = classNames({
    "flex items-center space-x-1": true,
    "rounded border-0 leading-none py-2 px-3 text-white outline-offset-2": true,
    "bg-sky-500 hover:bg-sky-400 outline-sky-400": color === "blue",
    "bg-green-500 hover:bg-green-400 outline-green-400": color === "green",
    "bg-red-500 hover:bg-red-400 outline-red-400": color === "red",
    "bg-slate-500 hover:bg-slate-400 outline-slate-400": color === "slate",
    "text-sm": textSize === "sm",
  });

  return (
    <button
      type={submit ? "submit" : undefined}
      className={className}
      onClick={onClick}
    >
      {icon}
      <span>{text}</span>
    </button>
  );
};

export default Button;
