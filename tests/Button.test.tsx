import { render, screen } from "@testing-library/react";
import Button from "components/Button";

describe("Button", () => {
  it("renders a button", () => {
    const text = "text";
    const { container } = render(<Button text={text} />);

    const content = screen.getByText(text);

    expect(content).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });
});
