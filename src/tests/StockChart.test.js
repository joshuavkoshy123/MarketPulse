import React from "react";
import {render, screen, act} from "@testing-library/react";
import StockChart from "../components/StockChart";
import {stock} from "../resources/stock";

jest.mock("../resources/stock", () => ({
	stock: {fetchStock: jest.fn(),},
}));

describe("StockChart Component", () => {
	beforeEach(() => {
    	jest.clearAllMocks();
	});

	test("renders the stock chart with correct title", async () => {
		const mockXValues = ["2024-03-01", "2024-03-02", "2024-03-03"];
		const mockYValues = [150, 155, 160];

		stock.fetchStock.mockImplementation((_ticker, callback) => {
			callback(mockXValues, mockYValues);
		});

		await act(async () => {
			render(<StockChart ticker="AAPL" />);
		});

		expect(screen.getByText("AAPL")).toBeInTheDocument();
	});

	test("fetches new data when ticker changes", async () => {
		const mockXValuesAAPL = ["2024-03-01", "2024-03-02", "2024-03-03"];
		const mockYValuesAAPL = [150, 155, 160];

		const mockXValuesGOOG = ["2024-03-04", "2024-03-05", "2024-03-06"];
		const mockYValuesGOOG = [2800, 2850, 2900];

		stock.fetchStock.mockImplementation((ticker, callback) => {
			if (ticker === "AAPL") {
				callback(mockXValuesAAPL, mockYValuesAAPL);
			} else if (ticker === "GOOG") {
				callback(mockXValuesGOOG, mockYValuesGOOG);
			}
		});

		const {rerender} = render(<StockChart ticker="AAPL" />);
		expect(stock.fetchStock).toHaveBeenCalledWith("AAPL", expect.any(Function));

		await act(async () => {
			rerender(<StockChart ticker="GOOG" />);
		});
		expect(stock.fetchStock).toHaveBeenCalledWith("GOOG", expect.any(Function));
	});
});
