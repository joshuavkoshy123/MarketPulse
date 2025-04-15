import React, { Component } from 'react';
//import { alphaVantage } from '../config/alphaVantage.js';
import { stock } from '../resources/stock.js';
import './StockRow.css';
import { auth, db } from '../config/config.js';
import { doc, setDoc, arrayUnion } from 'firebase/firestore';
import { type } from '@testing-library/user-event/dist/type/index.js';

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

    addToFavorites = async (ticker, name) => {
        
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
                <div className="stock-info" onClick={() => this.props.onClick()} style={{ cursor: "pointer" }}>
                    <div className="stock-header">
                        <b className="stock-ticker">{this.props.ticker}</b> 
                        <span className="change" style={this.changeStyle()}>
                            ${this.state.data ? Number(this.state.data.price_change).toFixed(2) : "Loading..."} ({this.state.data ? Number(this.state.data.percent_change).toFixed(2) : "Loading..."}%)
                        </span>
                    </div>
                    <p className="stock-name">{this.props.name}</p>
                    <div className="stock-price">${this.state.data ? Number(this.state.data.price).toFixed(2) : "Loading..."}</div>
                </div>
                <button 
                    className="add-to-favorites-btn" 
                    onClick={(e) => {
                        e.stopPropagation();
                        this.addToFavorites(this.props.ticker, this.props.name);
                    }}
                >
                    Add To Favorites
                </button>
            </li>
        )
    }
}

export default StockRow;