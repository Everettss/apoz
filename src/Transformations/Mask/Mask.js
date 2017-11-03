import React, { Component } from 'react';
import _ from 'lodash';
import NumericInput from 'react-numeric-input';
import './Mask.css';

class Mask extends Component {
    constructor(props) {
        super(props);

        this.state = {
            filter: props.filter
        };

        this.filterInputHandler = this.filterInputHandler.bind(this);
    }

    filterInputHandler(i, j) {
        return val => {
            const filter = _.cloneDeep(this.state.filter);
            filter[i][j] = val;
            this.setState({ filter });
            this.props.callback(filter);
        }
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
                {this.prepareMask(3, 3)} //TODO change to editable size
            </div>
        );
    }
}

export default Mask;
