import React, { Component } from 'react';
import _ from 'lodash';
import NumericInput from 'react-numeric-input';
import './Mask.css';
import { resize2DArray, getMaskMiddleIndexes, setArrayToDefaultValue } from '../../utils/helpers';

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
        this.maskFillerHandler = this.maskFillerHandler.bind(this);
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

    // fills mask with predefined figures selected by a user
    maskFillerHandler (type) {
        return e => {
            // son of a bitch... this part gave me serious headache. Who would have thought that you have to return anything...
            // and that the event is actually passed automagically to this handler...
            // and not preventing default results in endless recursive loop in render function
            e.preventDefault();
            let constantFilled = 1;
            let constantEmpty = 0;
            var newFilter = setArrayToDefaultValue(this.state.filter, constantEmpty);
            let middleIndexes = getMaskMiddleIndexes(newFilter);
            let filterH = newFilter[0].length;
            let filterW = newFilter.length;

            switch (type) {
                case "cross":
                    for (var x = 0; x < filterH; x++) {
                        console.log("x=" + x);
                        newFilter[x][middleIndexes.y] = constantFilled;
                    }
                    for (var y = 0; y < filterW; y++) {
                        newFilter[middleIndexes.x][y] = constantFilled;
                    }

                    break;

                default:
                    //do nothing
                    break;
            }

            console.log(newFilter);
            this.setState({filter: newFilter});
        }

    }

    prepareMaskControlPane () {

        return (<div>
                <div className="filter-inputs__row">
                    <button
                        className="filter-inputs__input"
                        onClick={this.maskFillerHandler("cross")}
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
