import Button from "components/Button";
import MarkdownViewer from "components/MarkdownViewer";
import FullScreenMin from "./FullScreenMim";

type FullScreenViewerProps = { markdown: string; onShrink: () => void };

const FullScreenViewer = (props: FullScreenViewerProps) => {
  return (
    <div className="">
      <div>
        <Button
          text="Shrink"
          icon={<FullScreenMin />}
          onClick={props.onShrink}
        />
      </div>
      <div className="p-4">
        <MarkdownViewer markdown={props.markdown} className="mx-auto" />
      </div>
    </div>
  );
};

export default FullScreenViewer;
