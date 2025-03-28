//import { alphaVantage } from '../config/alphaVantage.js';
import { twelvedata } from "../config/twelvedata";

export const stock = {

    latestPrice: (ticker, callback) => {
        //const url = `${alphaVantage.base_url}function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${alphaVantage.api_token}`;
        fetch(stock.latestPriceURL(ticker))
        .then((response) => response.json())
        .then((data) => callback(stock.formatPriceData(data)))
        .catch(error => console.error("API Fetch Error:", error));
    },

    latestPriceURL: (ticker) => {
        return `${twelvedata.base_url}/quote?symbol=${ticker}&apikey=${twelvedata.api_token}`;
    },

    formatPriceData: (data) => {
        const stockData = data;
        const formattedData = {};
        // formattedData.price = stockData["05. price"]
        // formattedData.date = stockData["07. latest trading day"]
        // formattedData.price_change = stockData["09. change"]
        // formattedData.percent_change = stockData["10. change percent"]
        formattedData.price = stockData.close
        //formattedData.date = stockData.close
        formattedData.price_change = stockData.change
        formattedData.percent_change = stockData.percent_change
        return formattedData
    }
}