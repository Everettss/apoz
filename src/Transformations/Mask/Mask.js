import React, { Component } from 'react';
import _ from 'lodash';
import NumericInput from 'react-numeric-input';
import './Mask.css';
import { resize2DArray, getMaskMiddleIndexes, createEmptyArrayWithDefaultValue } from '../../utils/helpers';

class Mask extends Component {
    constructor(props) {
        super(props);

        this.state = {
            filter: props.filter,
            maskHeight: props.filter.length,
            maskWidth: props.filter[0].length,
            fillerSetValue: 1
        };

        this.filterInputHandler = this.filterInputHandler.bind(this);
        this.fillerValueChangeHandler = this.fillerValueChangeHandler.bind(this);
        this.maskSizeChangeHandler = this.maskSizeChangeHandler.bind(this);
        this.maskFillerHandler = this.maskFillerHandler.bind(this);
    }



    filterInputHandler(i, j) {
        return val => {
            const filter = _.cloneDeep(this.state.filter);
            filter[i][j] = val;
            this.setState({filter});
            this.props.callback(filter);
        }
    }

    fillerValueChangeHandler() {
        return val => {
            this.setState({ fillerSetValue: val });
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

    // fills mask with predefined figures selected by a user
    maskFillerHandler (type) {
        return e => {
            // this part gave me serious headache. Who would have thought that you have to return anything...
            // and that the event is actually passed automagically to this handler...
            // and not preventing default results in endless recursive loop in render function
            e.preventDefault();
            let constantFilled = this.state.fillerSetValue;
            let constantEmpty = 0;
            let filterH = this.state.maskHeight;
            let filterW = this.state.maskWidth;
            var newFilter = createEmptyArrayWithDefaultValue(filterW, filterH, constantEmpty);
            let middleIndexes = getMaskMiddleIndexes(newFilter);

            switch (type) {
                case "cross":
                    for (var x = 0; x < filterH; x++) {
                        newFilter[x][middleIndexes.y] = constantFilled;
                    }
                    for (var y = 0; y < filterW; y++) {
                        newFilter[middleIndexes.x][y] = constantFilled;
                    }
                    break;

                case "x":
                    for (var x = 0, y = 0; x < Math.min(filterH, filterW); x++, y++) {
                        newFilter[x][y] = constantFilled;
                        newFilter[x][filterW - 1 - y] = constantFilled;
                    }
                    break;

                case "double-cross":
                    // if height is less than 3 there is no possibility to get double cross
                    // so fill simple cross
                    if (filterH > 2 ) {
                        for (var x = 0; x < filterH; x++) {
                            newFilter[x][middleIndexes.y] = constantFilled;
                        }
                        for (var y = 0; y < filterW; y++) {
                            newFilter[middleIndexes.x - 1][y] = constantFilled;
                            newFilter[middleIndexes.x + 1][y] = constantFilled;
                        }
                    } else {
                        this.maskFillerHandler("cross");
                    }
                    break;

                case "sides-vertical":
                    for (var x = 0; x < filterH; x++) {
                        newFilter[x][0] = constantFilled;
                        newFilter[x][filterW - 1] = constantFilled;
                    }
                    break;

                case "sides-horizontal":
                    for (var y = 0; y < filterW; y++) {
                        newFilter[0][y] = constantFilled;
                        newFilter[filterH - 1][y] = constantFilled;
                    }
                    break;

                default:
                    //do nothing
                    break;
            }

            this.setState({filter: newFilter});
            this.props.callback(newFilter);
        }

    }

    prepareMaskControlPane () {

        return (<div>
                <div className="filter-inputs__row">
                    <button
                        className="filter-inputs__input"
                        onClick={this.maskFillerHandler("cross")}
                    >cr</button>
                    <button
                        className="filter-inputs__input"
                        onClick={this.maskFillerHandler("x")}
                    >x</button>
                    <button
                        className="filter-inputs__input"
                        onClick={this.maskFillerHandler("double-cross")}
                    >dc</button>
                    <button
                        className="filter-inputs__input"
                        onClick={this.maskFillerHandler("sides-vertical")}
                    >||</button>
                    <button
                        className="filter-inputs__input"
                        onClick={this.maskFillerHandler("sides-horizontal")}
                    >=</button>
                    {/*clear*/}
                    <button
                        className="filter-inputs__input"
                        onClick={this.maskFillerHandler("")}
                    > </button>
                </div>
                <div className="filter-inputs__row">
                    <span>filler set value</span>
                        <NumericInput
                        className="filter-inputs__input"
                        style={false}
                        min={0}
                        max={99}
                        value={this.state.fillerSetValue}
                        onChange={this.fillerValueChangeHandler()}
                        />
                </div>
                <div
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
        </div>
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
