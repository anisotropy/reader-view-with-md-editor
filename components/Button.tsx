import classNames from "classnames";
import FullScreenMax from "./icons/FullScreenMax";

type ButtonProps = {
  text?: string;
  submit?: boolean;
  color?: "blue" | "green" | "red" | "slate" | "orange" | "black";
  textSize?: "sm";
  Icon?: (props: { className?: string }) => JSX.Element;
  className?: string;
  disabled?: boolean;
  href?: string;
  border?: boolean;
  circle?: boolean;
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
  circle,
  fontBold,
  iconSpin,
  onClick,
}: ButtonProps) => {
  const styleWithoutBorder = {
    "border-0 text-white disabled:bg-slate-400": true,
    "bg-sky-700 outline-sky-700": color === "blue",
    "bg-slate-900 outline-slate-900": color === "black",
  };

  const styleWithBorder = {
    "border bg-white disabled:border-slate-400 disabled:text-slate-400": true,
    "border-slate-700 text-slate-700 outline-slate-700": color === "black",
    "border-red-900 text-red-900 outline-red-900": color === "red",
  };

  const className = classNames({
    "relative flex items-center space-x-1": true,
    "leading-none outline-offset-2": true,
    "hover:drop-shadow hover:-top-px hover:-left-px": !disabled,
    "text-sm h-8": textSize === "sm",
    rounded: !circle,
    "px-3": !circle && textSize === "sm" && text && !Icon,
    "pl-2 pr-3": !circle && textSize === "sm" && text && Icon,
    "px-2": !circle && textSize === "sm" && !text && Icon,
    "rounded-full": circle,
    "w-8 justify-center": circle && textSize === "sm",
    "font-bold": fontBold,
    ...(border ? styleWithBorder : styleWithoutBorder),
    [extraClassName || ""]: Boolean(extraClassName),
  });

  const iconClassName = classNames({
    "fill-current": true,
    "w-5": textSize === "sm",
    "animate-spin": iconSpin,
  });

  const iconAndText = (
    <>
      {Icon && <Icon className={iconClassName} />}
      {text && <span>{text}</span>}
    </>
  );

  return href ? (
    <a
      target="_blank"
      rel="noreferrer"
      href={href}
      role="button"
      className={className}
    >
      {iconAndText}
    </a>
  ) : (
    <button
      type={submit ? "submit" : undefined}
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {iconAndText}
    </button>
  );
};

export default Button;
