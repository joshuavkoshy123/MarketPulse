import "bootstrap/dist/css/bootstrap.min.css";
import '../App.css';

import React, { useState } from "react";
import StockRow from '../components/StockRow.js';
import StockChart from '../components/StockChart.js';
import Data from '../stock-data.json';

function Stocks() {
  const [chartTicker, setChartTicker] = useState("AAPL");
  const [chartName, setChartName] = useState("Apple Inc.");
  const [query, setQuery] = useState("");
  
  const filteredStocks = Data.filter(stock => {
    if (query === '') {
      return stock;
    } else if (stock.ticker.toLowerCase().includes(query.toLowerCase())) {
      return stock;
    } else if (stock.name.toLowerCase().includes(query.toLowerCase())) {
      return stock;
    }
  });

  // Find the current stock data for the price display
  const currentStock = Data.find(stock => stock.ticker === chartTicker);
  const currentPrice = currentStock ? currentStock.price : "202.52";

  return (
    <div className="stocks-page">
      <div className="navigation">
        <div className="nav-links">
          <span className="nav-title">Stocks</span>
        </div>
        <hr />
      </div>
      
      <div className="search-container">
        <input 
          className="search-input" 
          placeholder="Enter a stock ticker or stock name..." 
          onChange={event => setQuery(event.target.value)}
        />
      </div>
      
      <div className="stocks-container">
        <div className="saved-stocks-sidebar">
          <h2 className="sidebar-title">Saved</h2>
          <div className="saved-stocks-list">
            <ul className="list-group list-group-flush">
              {filteredStocks.slice(0, 5).map((stock, ticker) => (
                <div key={ticker}>
                  <StockRow 
                    ticker={stock.ticker} 
                    name={stock.name} 
                    onClick={() => {setChartTicker(stock.ticker); setChartName(stock.name);}}
                  />
                </div>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="stock-detail">
          <div className="stock-header-container">
            <div className="stock-identity">
              <div></div>
            </div>
            <div className="action-buttons">
              <button className="btn-action save">Save</button>
              <button className="btn-action view">View</button>
            </div>
          </div>
          
          <div className="chart-container">
            <StockChart ticker={chartTicker} name={chartName} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stocks;