import React, { Component } from 'react';
import _ from 'lodash';
import NumericInput from 'react-numeric-input';
import './Mask.css';
import { resize2DArray } from '../../utils/helpers';

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
        var isChange = false;
        return val => {
            if (dim === "w") {
                const maskWidth = val;
                var filter = _.cloneDeep(this.state.filter);
                filter = resize2DArray(filter, val, this.state.maskHeight, 0, true);
                this.setState ({ filter: filter, maskWidth: maskWidth });

                isChange = true;
            } else {
                if (val !== this.state.maskHeight) {
                    const maskHeight = val;
                    var filter = _.cloneDeep(this.state.filter);
                    filter = resize2DArray(filter, this.state.maskWidth, val, 0, true);
                    this.setState ({filter: filter, maskHeight: maskHeight});
                    isChange = true;
                }
            }

            if (isChange) this.render();
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
        this.setState({
            filter: nextProps.filter,
            maskHeight: nextProps.filter.length,
            maskWidth: nextProps.filter[0].length,
        })
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
                {this.prepareMask(this.state.maskHeight, this.state.maskWidth)}
            </div>
        );
    }
}

export default Mask;
