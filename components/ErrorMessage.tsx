import Backdrop from "./Backdrop";
import Button from "./Button";
import Dismiss from "./icons/Dismiss";
import Warning from "./icons/Warning";

type ErrorMessageProps = { children: string; onClose: () => void };

const ErrorMessage = ({ children, onClose }: ErrorMessageProps) => {
  return (
    <Backdrop>
      <div className="flex flex-col items-center space-y-8 w-full max-w-md rounded p-4 bg-white font-sans text-slate-700">
        <div className="grid gap-2 grid-flow-col auto-cols-auto">
          <div className="w-8">
            <Warning className="fill-slate-700 w-8" />
          </div>
          <div className="flex items-center">
            <p>{children}</p>
          </div>
        </div>
        <Button text="Close" Icon={Dismiss} onClick={onClose} />
      </div>
    </Backdrop>
  );
};

export default ErrorMessage;
