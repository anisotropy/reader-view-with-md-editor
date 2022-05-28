import classNames from "classnames";
import FullScreenMax from "./icons/FullScreenMax";

type ButtonProps = {
  text: string;
  submit?: boolean;
  color?: "blue" | "green" | "red" | "slate" | "orange" | "black";
  textSize?: "sm";
  Icon?: (props: { className?: string }) => JSX.Element;
  className?: string;
  disabled?: boolean;
  href?: string;
  border?: boolean;
  fontBold?: boolean;
  onClick?: () => void;
};

const Button = ({
  text,
  submit,
  color = "blue",
  textSize = "sm",
  Icon,
  className: extraClassName,
  disabled,
  href,
  border,
  fontBold,
  onClick,
}: ButtonProps) => {
  const styleWithoutBorder = {
    "border-0 text-white": true,
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
    "bg-slate-900 hover:bg-slate-800 outline-slate-800 disabled:bg-black":
      color === "black",
  };

  const styleWithBorder = {
    border: true,
    "border-slate-700 text-slate-700 hover:bg-slate-700/10 disabled:text-slate-400 disabled:bg-transparent":
      color === "black",
  };

  const className = classNames({
    "flex items-center space-x-1": true,
    "rounded leading-none outline-offset-2": true,
    "text-sm h-8": textSize === "sm",
    "px-3": textSize === "sm" && !Icon,
    "pl-2 pr-3": textSize === "sm" && Icon,
    "font-bold": fontBold,
    ...(border ? styleWithBorder : styleWithoutBorder),
    [extraClassName || ""]: Boolean(extraClassName),
  });

  const iconClassName = classNames({
    "fill-slate-700": border,
  });

  return href ? (
    <a
      target="_blank"
      rel="noreferrer"
      href={href}
      role="button"
      className={className}
    >
      {Icon && <Icon className={iconClassName} />}
      <span>{text}</span>
    </a>
  ) : (
    <button
      type={submit ? "submit" : undefined}
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {Icon && <Icon className={iconClassName} />}
      <span>{text}</span>
    </button>
  );
};

export default Button;
