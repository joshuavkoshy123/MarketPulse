import "bootstrap/dist/css/bootstrap.min.css";
import '../App.css';

import React, { useState } from "react";
import StockRow from '../components/StockRow.js';
import StockChart from '../components/StockChart.js';
import Data from '../stock-data.json';

function Stocks() {
  const [chartTicker, setChartTicker] = useState("AAPL");
  // let chartTicker = "";
  // const setChartTicker = (stock) => {
  //   console.log(stock.stock.stock_ticker);
  //   chartTicker = stock.stock.stock_ticker;
  // }
  const [query, setQuery] = useState("");
  const filteredStocks = Data.filter(stock => {
    if (query === '') {
      return stock;
    } else if (stock.ticker.toLowerCase().includes(query.toLowerCase())) {
      return stock;
    }
  });

  return (
    <div className="App">
      <input className="col-md-4" placeholder="Enter a stock ticker or stock name... " onChange={event => setQuery(event.target.value)} />
      <div className="container">
        <div className="row">
          <div className="col-md-4 mt-5">
            <div className="card">
              <div className="card-body">
                <ul className="list-group list-group-flush">
                {
                  filteredStocks.slice(0, 5).map((stock, ticker) => (
                    <div className="box" key={ticker}>
                      <StockRow ticker={stock.ticker} onClick={() => setChartTicker(stock.ticker)}/>
                    </div>
                  ))
                  // Data.map((stock) => (
                  //   <div key={stock.id}>
                  //     <StockRow ticker={stock.stock_ticker} onClick={() => setChartTicker({stock})}/>
                  //   </div>
                  // ))
                }
                  {/* <StockRow ticker="AAPL" onClick={() => setChartTicker("AAPL")}/>
                  <StockRow ticker="GOOG" onClick={() => setChartTicker("GOOG")}/>
                  <StockRow ticker="MSFT" onClick={() => setChartTicker("MSFT")}/>
                  <StockRow ticker="MLGO" onClick={() => setChartTicker("MLGO")}/> */}
                </ul>
              </div>
            </div>
          </div>
          <div className='col-md-8'>
            <div className="chart">
              <StockChart ticker={chartTicker}></StockChart>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Stocks;