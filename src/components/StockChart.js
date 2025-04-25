import React from 'react';
import { stock } from '../resources/stock.js';
import Plot from 'react-plotly.js';
import './StockChart.css';

class StockChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stockChartXValues: [],
            stockChartYValues: [],
            keyStatistics: {}
        };
        this.apiCalled = false;
    }

    componentDidMount() {
        if (!this.apiCalled) {
            this.apiCalled = true;
            stock.fetchStock(this.props.ticker, this.applyData.bind(this));
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.ticker !== this.props.ticker) {
            stock.fetchStock(this.props.ticker, this.applyData.bind(this));
        }
    }

    applyData(xValues, yValues, keyStats) {
        this.setState ({
            stockChartXValues: xValues,
            stockChartYValues: yValues,
            keyStatistics: keyStats
        });
    }

    render() {
        return (
            <div>
                <div>
                    <h2>{this.props.ticker}</h2>
                    <h4>{this.props.name}</h4>
                    <Plot
                        data={[
                        {
                            x: this.state.stockChartXValues,
                            y: this.state.stockChartYValues,
                            type: 'scatter',
                            mode: 'lines+markers',
                            marker: {color: 'blue'},
                        }
                        ]}
                        layout={ {width: 720, height: 440, title: {text: `$${Number(this.state.stockChartYValues[0]).toFixed(2)}`}} }
                    />
                </div>
                <div className="stats-container">
                    <h3>Key Statistics</h3>
                    <table className="keyStats">
                        <tr>
                            <td>Open: {Number(this.state.keyStatistics.open).toFixed(2)}</td>
                            <td>Close: {Number(this.state.keyStatistics.close).toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>High: {Number(this.state.keyStatistics.high).toFixed(2)}</td>
                            <td>Low: {Number(this.state.keyStatistics.low).toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Prev Close: {Number(this.state.keyStatistics.prev_close).toFixed(2)}</td>
                            <td>Volume: {this.state.keyStatistics.volume}</td>
                        </tr>
                    </table>
                </div>
            </div>
        )
    }
}

export default StockChart;