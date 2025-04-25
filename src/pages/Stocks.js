import "bootstrap/dist/css/bootstrap.min.css";
import '../App.css';

import React, { useState, useEffect } from "react";
import StockRow from '../components/StockRow.js';
import StockChart from '../components/StockChart.js';
import Data from '../stock-data.json';
import { auth, db } from '../config/config.js';
import { doc, setDoc, arrayUnion, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

function Stocks() {
  const [chartTicker, setChartTicker] = useState("AAPL");
  const [chartName, setChartName] = useState("Apple Inc.");
  const [query, setQuery] = useState("");
  //const [isFavorite, setFavorite] = useState(false);
  const [favorites, setFavorites] = useState([]);
  
  const filteredStocks = Data.filter(stock => {
    if (query === '') {
      return stock;
    } else if (stock.ticker.toLowerCase().includes(query.toLowerCase())) {
      return stock;
    } else if (stock.name.toLowerCase().includes(query.toLowerCase())) {
      return stock;
    }
  });

  const addToFavorites = async (ticker, name) => {
        
        try {
            const user = auth.currentUser;

            if (!user) {
                throw new Error("User not authenticated.");
            }

            const stockData = {
                ticker: ticker,
                name: name,
                type: "stock"
            };

            const userDoc = doc(db, 'users', user.uid);

            await setDoc(userDoc, {
                favorites: arrayUnion(stockData)
            }, { merge: true });

        }
        catch (error) {
            console.error("There has been an error: ", error);
            //setError("Failed to add stock to favorites");
        }
  }

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userDoc = doc(db, 'users', user.uid);
  
        const unsubscribeSnapshot = onSnapshot(userDoc, (docSnapshot) => {
          const data = docSnapshot.data();
          if (data && data.favorites) {
            setFavorites(data.favorites);
            console.log("Favorites updated:", data.favorites);
          }
        });
  
        // Clean up the Firestore listener when auth state or component changes
        return () => unsubscribeSnapshot();
      }
    });
  
    // Clean up the auth state listener
    return () => unsubscribeAuth();
  }, []);

  // Check if stock is contained in favorites
  const isFavorite = (ticker) => {
    return favorites.some(stock => stock.ticker === ticker);
  };

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
                <div style={{ flexDirection: "column", gap: 0, margin: 0, padding: 0 }} key={ticker}>
                  <StockRow 
                    ticker={stock.ticker} 
                    name={stock.name} 
                    onClick={() => {setChartTicker(stock.ticker); setChartName(stock.name);}}
                  />
                  <button
                    className="favorites-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToFavorites(stock.ticker, stock.name);
                    }}
                    style={{ margin: 0 }}
                  >
                    {isFavorite(stock.ticker) ? 'Added To Favorites' : 'Add To Favorites'}
                  </button>
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
              <button className="btn-action save" onClick={() => addToFavorites(chartTicker, chartName)}>Save</button>
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