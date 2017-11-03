import React, { Component } from 'react';
import _ from 'lodash';
import NumericInput from 'react-numeric-input';
import './Mask.css';
//import * as preselected from './preselected';
import { forEachPixel, flattenMatrix, cloneImage, scale } from '../../utils/helpers';

//TODO - clean up, pass masks from other components to this one,
// and notifying components using this one about filter changes

const detectMinusValInFilter = arr => !!flattenMatrix(arr).filter(x => x < 0).length;

const filterTransformation = (edgeRule, scaleRule, filter, type, M = 256) => image => {
    console.log('edgeRule', edgeRule);
    console.log('scaleRule', scaleRule);
    console.log('filter', filter);
    console.log('type', type);

    const newImage = cloneImage(image); // you can't mutate image during computation

    let algorithm = arr => {
         let outputValue = 0;
                let filterTotal = flattenMatrix(filter).reduce((acc, x) => acc + x, 0);
                for (let x = 0; x < 3; x++) {
                    for (let y = 0; y < 3; y++) {
                        outputValue += arr[x][y] * filter[x][y] / (filterTotal ? filterTotal : 1);
                    }
                }
                return Math.round(scale(scaleRule, outputValue, 0, M - 1) );
    };

    let operationOnPixelNeighbours;
    if (edgeRule === 'not-modify') {
        operationOnPixelNeighbours = arr => {
            const flattenMask = flattenMatrix(arr);
            if (flattenMask.filter(x => x !== null).length < 9) { // missing
                return arr[1][1]; // get center pixel
            } else {
               return algorithm(arr);
            }
        };
    } else {
        operationOnPixelNeighbours = arr => {
            return algorithm(arr);
        };
    }

    forEachPixel(image, operationOnPixelNeighbours, newImage, { type: edgeRule });

    return {
        title: `filter`,
        picture: newImage
    };
};



class Mask extends Component {
    constructor(props) {
        super(props);

        this.state = {
            filter: [
                ['', '', '', '', ''],
                ['', '', '', '', ''],
                ['', '', '', '', ''],
            ]
        };

        this.filterInputHandler = this.filterInputHandler.bind(this);
    }

    filterInputHandler(i, j) {
        return val => {
            const filter = _.cloneDeep(this.state.filter);
            filter[i][j] = val;
            this.setState({ filter });
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
                {this.prepareMask(3, 5)} //TODO change to editable size
            </div>
        );
    }
}

export default Mask;
export { filterTransformation };
