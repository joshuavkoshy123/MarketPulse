//import { alphaVantage } from '../config/alphaVantage.js';
import { twelvedata } from "../config/twelvedata";
import { finnhub } from "../config/finnhub";

export const stock = {

    latestPrice: (ticker, callback) => {
        fetch(stock.latestPriceURL(ticker))
        .then((response) => response.json())
        .then((data) => callback(stock.formatPriceData(data)))
        .catch(error => console.error("API Fetch Error:", error));
    },

    latestPriceURL: (ticker) => {
        return `${finnhub.base_url}/quote?symbol=${ticker}&token=${finnhub.api_token}`
    },

    formatPriceData: (data) => {
        const stockData = data;
        const formattedData = {};
        formattedData.price = stockData["c"]
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
        let keyStatistics = {};
        fetch(stock.stockHistoryURL(ticker))
        .then((response) => response.json())
        .then(
            function(data) {
                console.log(data);

                for (let i = 0; i < 30; i++){
                    stockChartXValuesFunction.push(data.values[i].datetime);
                    stockChartYValuesFunction.push(data.values[i].close);
                }

                keyStatistics.prev_close = data.values[1].close;
                keyStatistics.open = data.values[0].open;
                keyStatistics.high = data.values[0].high;
                keyStatistics.low = data.values[0].low;
                keyStatistics.volume = data.values[0].volume;
                keyStatistics.close = data.values[0].close;

                //console.log(stockChartXValuesFunction);
                //console.log(stockChartYValuesFunction);
                callback(stockChartXValuesFunction, stockChartYValuesFunction, keyStatistics);
            }
        )
        .catch(error => console.error("API Fetch Error:", error));
    }
}