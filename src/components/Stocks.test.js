import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Stocks from "../pages/Stocks";
import Data from "../stock-data.json";
global.URL.createObjectURL = jest.fn();


describe("Stocks Component", () => {
  test("Show correct stock based on search", () => {
    render(<Stocks />);

    // Ensure input field is present
    const searchInput = screen.getByPlaceholderText("Enter a stock ticker or stock name...");
    expect(searchInput).toBeInTheDocument();

    // Initially, some stock rows should be present
    Data.slice(0, 5).forEach((stock) => {
      expect(screen.getByText(stock.ticker)).toBeInTheDocument();
    });

    // Simulate typing in the search box
    fireEvent.change(searchInput, { target: { value: "AAPL" } });

    // Expect only matching stock(s) to be displayed
    expect(screen.getByText("AAPL")).toBeInTheDocument();

    // Ensure non-matching stocks are not displayed
    Data.forEach((stock) => {
      if (stock.ticker !== "AAPL") {
        expect(screen.queryByText(stock.ticker)).not.toBeInTheDocument();
      }
    });
  });
});

test("shows no stocks when searching for a non-existent stock", () => {
    render(<Stocks />);

    const searchInput = screen.getByPlaceholderText("Enter a stock ticker or stock name...");
    expect(searchInput).toBeInTheDocument();

    // Simulate typing an invalid stock ticker
    fireEvent.change(searchInput, { target: { value: "XYZ123" } });

    // Ensure no stocks are found
    Data.forEach((stock) => {
      expect(screen.queryByText(stock.ticker)).not.toBeInTheDocument();
    });
});