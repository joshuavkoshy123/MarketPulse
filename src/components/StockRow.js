import React, { Component } from 'react';
//import { alphaVantage } from '../config/alphaVantage.js';
import { stock } from '../resources/stock.js';
import './StockRow.css'; 

class StockRow extends Component {

    //let apiCalled = false;

    constructor(props){
        super(props);
        this.state = {
            data: {}
        }
        this.firstApiCalled = false;
        this.updateApiCalled = false;
    }

    changeStyle() {
        let color;
        if (Number(this.state.data.price_change) > 0) {
            color = '#4caf50'
        }
        else {
            color = '#e53935'
        }
        return {
            color: color,
            fontSize: '0.8rem',
            marginLeft: 5
        }
    }

    applyData(data) {
        console.log(data)
        this.setState({
            data: data
        })
    }

    componentDidMount() {
        if (!this.firstApiCalled) {
            this.firstApiCalled = true;
            stock.latestPrice(this.props.ticker, this.applyData.bind(this));
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.ticker !== this.props.ticker) {
            stock.latestPrice(this.props.ticker, this.applyData.bind(this));
        }
    }

    render() {
        return (
            <li className="list-group-item">
                  <b className="stock-row" onClick={() => this.props.onClick()} style={{ cursor: "pointer" }}>
                    {this.props.ticker}
                    </b> 
                    ${this.state.data ? Number(this.state.data.price).toFixed(2) : "Loading..."}
                  <span className="change" style={this.changeStyle()}>
                  ${this.state.data ? Number(this.state.data.price_change).toFixed(2) : "Loading..."} ({this.state.data ? Number(this.state.data.percent_change).toFixed(2) : "Loading..."}%)
                  </span>
            </li>
            // <tr>
            //     <td></td>
            //     <td></td>
            //     <td>{this.state.data ? this.state.data.date : "Loading..."}</td>
            //     <td>{this.state.data ? this.state.data.percent_change : "Loading..."}</td>
            // </tr>
        )
    }
}

export default StockRow;