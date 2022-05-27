import { ReactNode } from "react";

type BackdropProps = { className?: string; children: ReactNode };

const Backdrop = ({ className, children }: BackdropProps) => {
  return (
    <div
      className={
        "fixed flex z-0 top-0 left-0 bottom-0 right-0" +
        (className ? ` ${className}` : "")
      }
    >
      <div className="absolute top-0 left-0 bottom-0 right-0 bg-gray-500/40" />
      <div className="flex justify-center items-center p-4 absolute top-0 left-0 bottom-0 right-0 drop-shadow-lg">
        {children}
      </div>
    </div>
  );
};

export default Backdrop;
