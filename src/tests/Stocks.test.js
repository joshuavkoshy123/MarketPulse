import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Stocks from "../pages/Stocks";
import Data from "../stock-data.json";
global.URL.createObjectURL = jest.fn();


describe("Stocks Component", () => {
	test("Show correct stock based on search", () => {
		render(<Stocks />);

		const searchInput = screen.getByPlaceholderText("Enter a stock ticker or stock name...");
		expect(searchInput).toBeInTheDocument();

		Data.slice(0, 5).forEach((stock) => {
			expect(screen.getByText(stock.ticker)).toBeInTheDocument();
		});

		fireEvent.change(searchInput, { target: { value: "NVDA" } });
		expect(screen.getByText("NVDA")).toBeInTheDocument();
		Data.forEach((stock) => {
			if(stock.ticker !== "NVDA" && stock.ticker !== "AAPL") {
				expect(screen.queryByText(stock.ticker)).not.toBeInTheDocument();
			}
		});
	});
});

	test("shows no stocks when searching for a non-existent stock", () => {
		render(<Stocks />);

		const searchInput = screen.getByPlaceholderText("Enter a stock ticker or stock name...");
		expect(searchInput).toBeInTheDocument();

		fireEvent.change(searchInput, { target: { value: "XYZ123" } });
		Data.forEach((stock) => {
			if(stock.ticker != "AAPL") {
				expect(screen.queryByText(stock.ticker)).not.toBeInTheDocument();
			}
		});
	}
);