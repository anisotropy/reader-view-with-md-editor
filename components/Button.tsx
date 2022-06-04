import classNames from "classnames";

type ButtonProps = {
  text?: string;
  submit?: boolean;
  color?: "blue" | "black";
  size?: "sm";
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
  size = "sm",
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
    "border-0 m-text-white disabled:m-bg-gray-light": true,
    "m-bg-sky m-outlint-sky": color === "blue",
    "m-bg-slate m-outline-slate": color === "black",
  };

  const styleWithBorder = {
    "border m-bg-white": true,
    "m-border-slate m-text-slate m-outline-slate": color === "black",
  };

  const className = classNames({
    "relative flex items-center space-x-1": true,
    "leading-none outline-offset-2": true,
    "disabled:m-border-gray-dark disabled:m-text-gray-dark disabled:m-outline-gray-dark":
      true,
    "hover:drop-shadow hover:-top-px hover:-left-px": !disabled,
    "text-sm h-8": size === "sm",
    rounded: !circle,
    "px-3": !circle && size === "sm" && text && !Icon,
    "pl-2 pr-3": !circle && size === "sm" && text && Icon,
    "px-2": !circle && size === "sm" && !text && Icon,
    "rounded-full": circle,
    "w-8 justify-center": circle && size === "sm",
    "font-bold": fontBold,
    ...(border ? styleWithBorder : styleWithoutBorder),
    [extraClassName || ""]: Boolean(extraClassName),
  });

  const iconClassName = classNames({
    "fill-current": true,
    "w-5": size === "sm",
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
