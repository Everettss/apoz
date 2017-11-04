import React, { Component } from 'react';
import _ from 'lodash';
import NumericInput from 'react-numeric-input';
import './Mask.css';

class Mask extends Component {
    constructor(props) {
        super(props);

        this.state = {
            filter: props.filter,
            maskHeight: props.filter.length,
            maskWidth: props.filter[0].length
        };

        this.filterInputHandler = this.filterInputHandler.bind(this);
        this.maskSizeChangeHandler = this.maskSizeChangeHandler.bind(this);
    }

    filterInputHandler(i, j) {
        return val => {
            const filter = _.cloneDeep(this.state.filter);
            filter[i][j] = val;
            this.setState({ filter });
            this.props.callback(filter);
        }
    }

    maskSizeChangeHandler (dim) {
        return val => {
            if (dim === "w") {
                if (val !== this.state.maskWidth) {
                    const maskWidth = val;
                    this.setState ({maskWidth});
                }
            } else {
                if (val !== this.state.maskHeight) {
                    const maskHeight = val;
                    this.setState ({maskHeight});
                }
            }
        }
    }

    prepareMaskControlPane () {

        return (<div
                className="filter-inputs__row">
                <span><b>H: </b></span>
                <NumericInput
                    className="filter-inputs__input"
                    style={false}
                    min={2}
                    max={9}
                    value={this.state.maskHeight}
                    onChange={this.maskSizeChangeHandler("h")}
                />
                <span><b> W: </b></span>
                <NumericInput
                    className="filter-inputs__input"
                    style={false}
                    min={2}
                    max={9}
                    value={this.state.maskWidth}
                    onChange={this.maskSizeChangeHandler("w")}
                /></div>
        )
    }

    prepareMask(x, y) {
        let columns = [];

        for (let i = 0; i < x; i++) {
            columns.push(this.prepareRow (i, y));
        }

        return (<div className="filter-inputs">
                    {columns}
                </div>)
    }

    prepareRow (i, width) {
        let rows = [];
        for (let j = 0; j < width; j++) {
            rows.push(this.inputFilter(i, j))
        }

        return (<div
                className="filter-inputs__row">
                    {rows}
                </div>);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({filter: nextProps.filter})
    }

    inputFilter(i, j) {
        return <NumericInput
            className="filter-inputs__input"
            style={false}
            min={-256 + 1}
            max={256 - 1}
            value={this.state.filter[i][j]}
            onChange={this.filterInputHandler(i, j)}
        />
    };

    render() {
        return (
            <div>
                <h4 className="aside__item__title">Mask</h4>
                {this.prepareMaskControlPane()}
                {this.prepareMask(3, 3)} //TODO change to editable size
            </div>
        );
    }
}

export default Mask;
