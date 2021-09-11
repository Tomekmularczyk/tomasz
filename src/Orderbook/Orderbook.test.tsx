import { Orderbook } from "./Orderbook";
import { render, screen, within } from "@testing-library/react";
import { InitialSnapshotMessage, ProductId } from "../types";
import userEvent from "@testing-library/user-event";

jest.mock("../useIsTabletAndAbove", () => ({
  useIsTabletAndAbove: () => true,
}));

describe("Orderbook", () => {
  const initialSnapshot: InitialSnapshotMessage = {
    numLevels: 3,
    asks: [
      [12, 100],
      [10.5, 250],
      [10, 350],
    ],
    bids: [
      [7, 50],
      [9, 150],
      [9.5, 200],
    ],
    feed: "book_ui_1_snapshot",
    product_id: ProductId.PI_XBTUSD,
  };

  it("renders bids and asks lists correctly given the initial snapshot", () => {
    render(
      <Orderbook
        initialSnapshot={initialSnapshot}
        feedStatus="feeding"
        onRestartFeedClick={jest.fn()}
        onToggleFeedClick={jest.fn()}
        deltas={[]}
      />
    );

    const [asksList, bidsList] = screen.getAllByRole("list");

    // test spread
    expect(screen.getByText("Spread: 0.5 (5.26%)")).toBeInTheDocument();

    // test asks list
    const askLevels = within(asksList).getAllByRole("listitem");
    const [askLevel1, askLevel2, askLevel3] = askLevels;
    expect(askLevels).toHaveLength(3);
    expect(within(askLevel1).getByTestId("price").textContent).toBe("10.00");
    expect(within(askLevel1).getByTestId("size").textContent).toBe("350");
    expect(within(askLevel1).getByTestId("total").textContent).toBe("350");
    expect(within(askLevel2).getByTestId("price").textContent).toBe("10.50");
    expect(within(askLevel2).getByTestId("size").textContent).toBe("250");
    expect(within(askLevel2).getByTestId("total").textContent).toBe("600");
    expect(within(askLevel3).getByTestId("price").textContent).toBe("12.00");
    expect(within(askLevel3).getByTestId("size").textContent).toBe("100");
    expect(within(askLevel3).getByTestId("total").textContent).toBe("700");

    // test bids list
    const bidLevels = within(bidsList).getAllByRole("listitem");
    const [bidLevel1, bidLevel2, bidLevel3] = bidLevels;
    expect(bidLevels).toHaveLength(3);
    expect(within(bidLevel1).getByTestId("price").textContent).toBe("9.50");
    expect(within(bidLevel1).getByTestId("size").textContent).toBe("200");
    expect(within(bidLevel1).getByTestId("total").textContent).toBe("200");
    expect(within(bidLevel2).getByTestId("price").textContent).toBe("9.00");
    expect(within(bidLevel2).getByTestId("size").textContent).toBe("150");
    expect(within(bidLevel2).getByTestId("total").textContent).toBe("350");
    expect(within(bidLevel3).getByTestId("price").textContent).toBe("7.00");
    expect(within(bidLevel3).getByTestId("size").textContent).toBe("50");
    expect(within(bidLevel3).getByTestId("total").textContent).toBe("400");
  });

  it("updates orderbook given delta messages", () => {
    render(
      <Orderbook
        initialSnapshot={initialSnapshot}
        feedStatus="feeding"
        onRestartFeedClick={jest.fn()}
        onToggleFeedClick={jest.fn()}
        deltas={[
          {
            feed: "book_ui_1",
            product_id: ProductId.PI_XBTUSD,
            asks: [
              [12, 0],
              [11, 100],
            ],
            bids: [],
          },
          {
            feed: "book_ui_1",
            product_id: ProductId.PI_XBTUSD,
            bids: [
              [7, 300],
              [8, 10],
              [9, 100],
              [9.5, 0],
            ],
            asks: [],
          },
        ]}
      />
    );

    const [asksList, bidsList] = screen.getAllByRole("list");

    // test spread
    expect(screen.getByText("Spread: 1.0 (11.11%)")).toBeInTheDocument();

    // test asks list
    const askLevels = within(asksList).getAllByRole("listitem");
    const [askLevel1, askLevel2, askLevel3] = askLevels;
    expect(askLevels).toHaveLength(3);
    expect(within(askLevel1).getByTestId("size").textContent).toBe("350");
    expect(within(askLevel1).getByTestId("total").textContent).toBe("350");
    expect(within(askLevel2).getByTestId("price").textContent).toBe("10.50");
    expect(within(askLevel2).getByTestId("size").textContent).toBe("250");
    expect(within(askLevel2).getByTestId("total").textContent).toBe("600");
    expect(within(askLevel3).getByTestId("price").textContent).toBe("11.00");
    expect(within(askLevel3).getByTestId("size").textContent).toBe("100");
    expect(within(askLevel3).getByTestId("total").textContent).toBe("700");

    // test bids list
    const bidLevels = within(bidsList).getAllByRole("listitem");
    const [bidLevel1, bidLevel2, bidLevel3] = bidLevels;
    expect(bidLevels).toHaveLength(3);
    expect(within(bidLevel1).getByTestId("price").textContent).toBe("9.00");
    expect(within(bidLevel1).getByTestId("size").textContent).toBe("100");
    expect(within(bidLevel1).getByTestId("total").textContent).toBe("100");
    expect(within(bidLevel2).getByTestId("price").textContent).toBe("8.00");
    expect(within(bidLevel2).getByTestId("size").textContent).toBe("10");
    expect(within(bidLevel2).getByTestId("total").textContent).toBe("110");
    expect(within(bidLevel3).getByTestId("price").textContent).toBe("7.00");
    expect(within(bidLevel3).getByTestId("size").textContent).toBe("300");
    expect(within(bidLevel3).getByTestId("total").textContent).toBe("410");
  });

  it("displays restart button when feed is stopped", () => {
    const onRestartFeedClick = jest.fn();

    const { rerender } = render(
      <Orderbook
        initialSnapshot={initialSnapshot}
        feedStatus="feeding"
        onRestartFeedClick={onRestartFeedClick}
        onToggleFeedClick={jest.fn()}
        deltas={[]}
      />
    );

    expect(
      screen.queryByRole("button", { name: "restart" })
    ).not.toBeInTheDocument();

    rerender(
      <Orderbook
        initialSnapshot={initialSnapshot}
        feedStatus="stopped"
        onRestartFeedClick={onRestartFeedClick}
        onToggleFeedClick={jest.fn()}
        deltas={[]}
      />
    );

    const restartButton = screen.getByRole("button", { name: "restart" });
    userEvent.click(restartButton);

    expect(restartButton).toBeInTheDocument();
    expect(onRestartFeedClick).toHaveBeenCalledTimes(1);
  });

  it("displays toggle feed button", () => {
    const onToggleFeedClick = jest.fn();

    render(
      <Orderbook
        initialSnapshot={initialSnapshot}
        feedStatus="feeding"
        onRestartFeedClick={jest.fn()}
        onToggleFeedClick={onToggleFeedClick}
        deltas={[]}
      />
    );

    const toggleFeedButton = screen.getByRole("button", {
      name: "Toggle Feed",
    });
    userEvent.click(toggleFeedButton);

    expect(toggleFeedButton).toBeInTheDocument();
    expect(onToggleFeedClick).toHaveBeenCalledTimes(1);
  });
});
