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
  iconSpin?: boolean;
  onClick?: () => void;
};

const Button = ({
  text,
  submit,
  color = "black",
  textSize = "sm",
  Icon,
  className: extraClassName,
  disabled,
  href,
  border,
  fontBold,
  iconSpin,
  onClick,
}: ButtonProps) => {
  const styleWithoutBorder = {
    "border-0 text-white": true,
    "bg-sky-700 outline-sky-700 disabled:bg-slate-500": color === "blue",
    "bg-slate-900 outline-slate-900 disabled:bg-slate-500": color === "black",
  };

  const styleWithBorder = {
    border: true,
    "bg-white border-slate-700 text-slate-700 outline-slate-700 disabled:text-slate-400":
      color === "black",
    "bg-white border-red-900 text-red-900 outline-slate-900 disabled:text-slate-400":
      color === "red",
  };

  const className = classNames({
    "flex items-center space-x-1": true,
    "rounded leading-none outline-offset-2": true,
    "relative hover:drop-shadow hover:-top-px hover:-left-px": true,
    "text-sm h-8": textSize === "sm",
    "px-3": textSize === "sm" && !Icon,
    "pl-2 pr-3": textSize === "sm" && Icon,
    "font-bold": fontBold,
    ...(border ? styleWithBorder : styleWithoutBorder),
    [extraClassName || ""]: Boolean(extraClassName),
  });

  const iconClassName = classNames({
    "fill-current": true,
    "w-5": textSize === "sm",
    "animate-spin": iconSpin,
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
