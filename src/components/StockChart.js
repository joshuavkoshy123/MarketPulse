import React from 'react';
import { stock } from '../resources/stock.js';
import Plot from 'react-plotly.js';

class StockChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stockChartXValues: [],
            stockChartYValues: []
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

    applyData(xValues, yValues) {
        this.setState ({
            stockChartXValues: xValues,
            stockChartYValues: yValues
        });
    }

    render() {
        return (
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
        )
    }
}

export default StockChart;