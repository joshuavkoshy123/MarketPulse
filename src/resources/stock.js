//import { alphaVantage } from '../config/alphaVantage.js';
import { twelvedata } from "../config/twelvedata";
import { finnhub } from "../config/finnhub";

export const stock = {

    latestPrice: (ticker, callback) => {
        //const url = `${alphaVantage.base_url}function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${alphaVantage.api_token}`;
        fetch(stock.latestPriceURL(ticker))
        .then((response) => response.json())
        .then((data) => callback(stock.formatPriceData(data)))
        .catch(error => console.error("API Fetch Error:", error));
    },

    latestPriceURL: (ticker) => {
        //return `${twelvedata.base_url}/quote?symbol=${ticker}&apikey=${twelvedata.api_token}`;
        return `${finnhub.base_url}/quote?symbol=${ticker}&token=${finnhub.api_token}`
    },

    formatPriceData: (data) => {
        const stockData = data;
        const formattedData = {};
        // formattedData.price = stockData["05. price"]
        // formattedData.date = stockData["07. latest trading day"]
        // formattedData.price_change = stockData["09. change"]
        // formattedData.percent_change = stockData["10. change percent"]
        formattedData.price = stockData["c"]
        //formattedData.date = stockData.close
        const price_change = stockData["c"] - stockData["pc"]
        formattedData.price_change = price_change
        formattedData.percent_change = (price_change / stockData["pc"]) * 100
        return formattedData
    },

    stockHistoryURL: (ticker) => {
        return `${twelvedata.base_url}/time_series?symbol=${ticker}&interval=1day&apikey=${twelvedata.api_token}`;
    },

    fetchStock: (ticker, callback) => {
        let stockChartXValuesFunction = [];
        let stockChartYValuesFunction = [];
        fetch(stock.stockHistoryURL(ticker))
        .then((response) => response.json())
        .then(
            function(data) {
                console.log(data);

                for (let i = 0; i < 30; i++){
                    stockChartXValuesFunction.push(data.values[i].datetime);
                    stockChartYValuesFunction.push(data.values[i].close);
                }

                //console.log(stockChartXValuesFunction);
                //console.log(stockChartYValuesFunction);
                callback(stockChartXValuesFunction, stockChartYValuesFunction);
            }
        )
        .catch(error => console.error("API Fetch Error:", error));
    }
}