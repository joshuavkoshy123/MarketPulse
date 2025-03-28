import logo from './logo.svg';
import "bootstrap/dist/css/bootstrap.min.css";

import StockRow from './components/StockRow.js';

function App() {
  return (
    <div className="App">
      <div className="container">
        <div className="col-md-5 mt-5">
          <div className="card">
            <div className="card-body">
              <ul className="list-group list-group-flush">
                <StockRow ticker="AAPL" />
                <StockRow ticker="GOOG" />
                <StockRow ticker="MSFT" />
                <StockRow ticker="MLGO" />
              </ul>
            </div>
          </div>
        </div>
        {/* <table className="table mt-5">
          <thead>
            <tr>
              <th>Ticker</th>
              <th>Price</th>
              <th>Date</th>
              <th>Change Percent</th>
            </tr>
          </thead>
          <tbody>
            <StockRow ticker="AAPL" />
            <StockRow ticker="GOOG" />
            <StockRow ticker="MSFT" />
            <StockRow ticker="TSLA" />
            <StockRow ticker="AMZN" />
          </tbody>
        </table> */}
      </div>
    </div>
  );
}

export default App;
