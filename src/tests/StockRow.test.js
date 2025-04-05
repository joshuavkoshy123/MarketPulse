import React from "react";
import {render, screen, waitFor} from "@testing-library/react";
import StockRow from "../components/StockRow";
import {stock} from "../resources/stock";
import userEvent from "@testing-library/user-event";

jest.mock("../resources/stock", () => ({
    stock: {latestPrice: jest.fn(),},
}));

describe("StockRow Component", () => {
    const mockStockData = {
        price: 150.25,
        price_change: 2.5,
        percent_change: 1.7,
    };

    beforeEach(() => {
        stock.latestPrice.mockImplementation((ticker, callback) => {
            callback(mockStockData);
        });
    });

    test("renders stock ticker and price", async () => {
        render(<StockRow ticker="AAPL" onClick={jest.fn()} />);
        expect(screen.getByText("AAPL")).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText("$150.25")).toBeInTheDocument();
            expect(screen.getByText("$2.50 (1.70%)")).toBeInTheDocument();
        });
    });

    test("calls onClick when stock ticker is clicked", async () => {
        const handleClick = jest.fn();
        render(<StockRow ticker="AAPL" onClick={handleClick} />);

        userEvent.click(screen.getByText("AAPL"));
        expect(handleClick).toHaveBeenCalled();
    });
});
