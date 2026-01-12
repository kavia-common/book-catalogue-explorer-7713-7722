import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders catalogue heading", () => {
  render(<App />);
  const heading = screen.getByText(/browse books/i);
  expect(heading).toBeInTheDocument();
});
