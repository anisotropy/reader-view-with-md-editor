import Button from "components/Button";
import MarkdownViewer from "components/MarkdownViewer";
import FullScreenMin from "./icons/FullScreenMim";

type FullScreenViewerProps = { markdown: string; onShrink: () => void };

const FullScreenViewer = (props: FullScreenViewerProps) => {
  return (
    <div className="pb-12">
      <div className="p-4">
        <MarkdownViewer markdown={props.markdown} className="mx-auto" />
      </div>
      <div className="fixed bottom-4 right-4">
        <Button
          text="Shrink"
          className="border border-white"
          Icon={FullScreenMin}
          onClick={props.onShrink}
        />
      </div>
    </div>
  );
};

export default FullScreenViewer;
