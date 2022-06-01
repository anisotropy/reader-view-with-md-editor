import Backdrop from "./Backdrop";
import Button from "./Button";
import Dismiss from "./icons/Dismiss";

type ErrorMessageProps = { children: string; onClose: () => void };

const ErrorMessage = ({ children, onClose }: ErrorMessageProps) => {
  return (
    <Backdrop>
      <div className="flex flex-col items-center space-y-4 w-full max-w-md rounded p-4 bg-white font-sans text-slate-700">
        <p>{children}</p>
        <Button text="Close" Icon={Dismiss} onClick={onClose} />
      </div>
    </Backdrop>
  );
};

export default ErrorMessage;
