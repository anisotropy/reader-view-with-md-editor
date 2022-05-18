import classNames from "classnames";

type ButtonProps = {
  submit?: boolean;
  color?: "blue" | "gray";
  children: string;
  onClick?: () => void;
};

const Button = ({ submit, color = "blue", children, onClick }: ButtonProps) => {
  const className = classNames(
    "rounded border-0 leading-none py-2 px-3 text-white outline-offset-2",
    {
      "bg-blue-500 hover:bg-blue-400 outline-blue-400": color === "blue",
      "bg-slate-500 hover:bg-slate-400 outline-slate-400": color === "gray",
    }
  );

  return (
    <button
      type={submit ? "submit" : undefined}
      className={className}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
