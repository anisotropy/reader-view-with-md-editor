import Button from "components/Button";
import MarkdownViewer from "components/MarkdownViewer";
import FullScreenMin from "./FullScreenMim";

type FullScreenViewerProps = { markdown: string; onShrink: () => void };

const FullScreenViewer = (props: FullScreenViewerProps) => {
  return (
    <div className="pb-12">
      <div className="p-4">
        <MarkdownViewer markdown={props.markdown} className="mx-auto" />
      </div>
      <Button
        text="Shrink"
        icon={<FullScreenMin />}
        onClick={props.onShrink}
        className="fixed bottom-4 right-4 shadow-md"
      />
    </div>
  );
};

export default FullScreenViewer;
