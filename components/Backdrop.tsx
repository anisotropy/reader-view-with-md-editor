import { ReactNode } from "react";

type BackdropProps = { className?: string; children: ReactNode };

const Backdrop = ({ className, children }: BackdropProps) => {
  return (
    <div style={{ all: "initial" }}>
      <div
        className={
          "fixed flex z-50 inset-0" + (className ? ` ${className}` : "")
        }
      >
        <div className="absolute inset-0 bg-gray-500/40" />
        <div className="flex justify-center items-center p-4 absolute inset-0 drop-shadow-lg font-sans">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Backdrop;
