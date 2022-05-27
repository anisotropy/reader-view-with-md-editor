import classNames from "classnames";
import React, { InputHTMLAttributes } from "react";
import { UseFormRegister } from "react-hook-form";

const Check = ({
  checked,
  disabled,
}: {
  checked: boolean | undefined;
  disabled?: boolean;
}) => {
  const className = classNames({
    "w-6 fill-sky-500": true,
    "hover:fill-sky-400": !disabled,
    "fill-sky-700": disabled,
  });
  return checked ? (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 1.999c5.524 0 10.002 4.478 10.002 10.002 0 5.523-4.478 10.001-10.002 10.001-5.524 0-10.002-4.478-10.002-10.001C1.998 6.477 6.476 1.999 12 1.999Zm0 1.5a8.502 8.502 0 1 0 0 17.003A8.502 8.502 0 0 0 12 3.5Zm-.003 2.5a5.998 5.998 0 1 1 0 11.996 5.998 5.998 0 0 1 0-11.996Z" />
    </svg>
  ) : (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Z" />
    </svg>
  );
};

const Radio = React.forwardRef<
  HTMLInputElement,
  { selectedValue: string } & InputHTMLAttributes<HTMLInputElement> &
    ReturnType<UseFormRegister<any>>
>(({ selectedValue, value, className, ...restProps }, ref) => {
  const checked = selectedValue === value;
  return (
    <label
      className={classNames({
        "inline-block": true,
        "cursor-pointer": !restProps.disabled,
        [className || ""]: Boolean(className),
      })}
      role="radio"
      aria-checked={checked}
    >
      <Check checked={checked} disabled={restProps.disabled} />
      <input
        {...restProps}
        ref={ref}
        type="radio"
        value={value}
        className="hidden"
      />
    </label>
  );
});

Radio.displayName = "Radio";

export default Radio;
