import React, { Component } from 'react';
import _ from 'lodash';
import './MaskCombination.css';
import * as preselected from '../../Lab3/Filter/preselected';
import { forEachPixel, flattenMatrix, cloneImage, scale } from '../../../utils/helpers';
import Mask from "../../Mask/Mask";

const detectMinusValInFilter = arr => !!flattenMatrix(arr).filter(x => x < 0).length;


const maskCombinationTransformation = (edgeRule, scaleRule, filter, type, M = 256) => image => {

    const newImage = cloneImage(image); // you can't mutate image during computation

    let algorithm = arr => {
         let outputValue = 0;
                let filterTotal = flattenMatrix(filter).reduce((acc, x) => acc + x, 0);
                for (let x = 0; x < arr.length; x++) {
                    for (let y = 0; y < arr[0].length; y++) {
                        outputValue += arr[x][y] * filter[x][y] / (filterTotal ? filterTotal : 1);
                    }
                }
                return Math.round(scale(scaleRule, outputValue, 0, M - 1) );
    };

    let operationOnPixelNeighbours;
    if (edgeRule === 'not-modify') {
        operationOnPixelNeighbours = arr => {
            const flattenMask = flattenMatrix(arr);
            if (flattenMask.filter(x => x !== null).length < arr.length * arr[0].length) { // missing
                return arr[2][2]; // get center pixel
            } else {
               return algorithm(arr);
            }
        };
    } else {
        operationOnPixelNeighbours = arr => {
            return algorithm(arr);
        };
    }

    forEachPixel(image, operationOnPixelNeighbours, newImage, {maskHeight: filter.length, maskWidth:filter[0].length, type: edgeRule });

    return {
        title: `mask combination`,
        picture: newImage
    };
};



class MaskCombination extends Component {
    constructor(props) {
        super(props);

        this.state = {
            edgeRule: 'not-modify',
            type: 'custom',
            scaleRule: 'proportional',
            showScaleMethod: false,
            ffilter: [
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0],
            ],
            gfilter: [
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0],
            ],
            combinedFilter: [
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
            ]
        };

        this.filterInputHandler = this.filterInputHandler.bind(this);
        this.radioEdgeHandler = this.radioEdgeHandler.bind(this);
        this.radioScaleHandler = this.radioScaleHandler.bind(this);
        this.formHandler = this.formHandler.bind(this);
        this.calculateCombinedFilter = this.calculateCombinedFilter.bind(this);
        this.ffilterUpdateCallback = this.ffilterUpdateCallback.bind(this);
        this.gfilterUpdateCallback = this.gfilterUpdateCallback.bind(this);
        this.combinedFilterUpdateCallback = this.combinedFilterUpdateCallback.bind(this);
    }

    calculateCombinedFilter = (ffilter, gfilter) => {
        let newCombinedFilter = new Array(5).fill(1).map(x => new Array(5).fill(1));
        let ffilterReduced = flattenMatrix(ffilter);
        let gfilterReduced = flattenMatrix(gfilter);
        let ffilterTotal = ffilterReduced.reduce((acc, x) => acc + x, 0);
        let gfilterTotal = gfilterReduced.reduce((acc, x) => acc + x, 0);
        let combinedFilterTotal = ffilterTotal * gfilterTotal;
        console.log (combinedFilterTotal);
        for (var i = 0; i < newCombinedFilter[0].length; i++) {
            for (var j = 0; j < newCombinedFilter.length; j++) {
                var currPointValue = 0;
                let currgfilterStartIndex = - 8 + (i * 3 + j);
                for (var k = 0; k < 9; k++) {
                    var currG = gfilterReduced[currgfilterStartIndex + k];
                    currPointValue += (currG ? currG : 0) * ffilterReduced[k];
                }
                newCombinedFilter[i][j] = currPointValue;
            }

        }
        this.setState({combinedFilter: newCombinedFilter, showScaleMethod: detectMinusValInFilter(gfilter)});
    };

    radioEdgeHandler(event) {
        this.setState({ edgeRule: event.target.value });
    }

    radioScaleHandler(event) {
        this.setState({ scaleRule: event.target.value });
    }

    filterInputHandler(i, j) {
        return val => {
            const filter = _.cloneDeep(this.state.ffilter);
            filter[i][j] = val;
            this.setState({ filter, type: 'custom', showScaleMethod: detectMinusValInFilter(filter) });
        }
    }
    handlePreselect(filter, type) {
        return e => {
            e.preventDefault();
            if (type === 'smooth') {
                this.setState({ffilter: filter, type, showScaleMethod: detectMinusValInFilter(filter)});
            }  else {
                this.setState({gfilter: filter, type, showScaleMethod: detectMinusValInFilter(filter)});
            }

            this.calculateCombinedFilter(this.state.ffilter, this.state.gfilter);
        }
    }

    formHandler(e) {
        e.preventDefault();
        this.props.updateImage(
            maskCombinationTransformation(this.state.edgeRule, this.state.scaleRule, this.state.combinedFilter, this.state.type)
        );
    }

    preselectedLink(filter, type, name) {
        return (
            <a
                className="filter-inputs__preselected-link"
                onClick={this.handlePreselect(filter, type)}
            >
                {name}
            </a>
        );
    };

    ffilterUpdateCallback (newFilter) {
        this.state.ffilter = newFilter;
        this.calculateCombinedFilter(newFilter, this.state.gfilter);
    }

    gfilterUpdateCallback (newFilter) {
        this.state.gfilter = newFilter;
        this.calculateCombinedFilter(this.state.ffilter, newFilter);
    }

    combinedFilterUpdateCallback (newFilter) {
        this.state.combinedFilter = newFilter;
    }

    render() {
        return (
            <div>
                <h3 className="aside__item__title">MaskCombination</h3>
                <form action="#" onSubmit={this.formHandler}>
                    <div className="form-wrapper">
                        <div className="form-col">
                            <Mask filter={this.state.ffilter} callback={this.ffilterUpdateCallback} />
                            <Mask filter={this.state.gfilter} callback={this.gfilterUpdateCallback} />
                            <Mask filter={this.state.combinedFilter} callback={this.combinedFilterUpdateCallback} />

                            <br/><strong>Edge</strong>
                            <div onChange={this.radioEdgeHandler}>
                                <input
                                    type="radio"
                                    value="not-modify"
                                    name="edgeRule"
                                    defaultChecked={this.state.edgeRule === 'not-modify'}
                                /> Not modify <br />
                                <input
                                    type="radio"
                                    value="duplicate"
                                    name="edgeRule"
                                    defaultChecked={this.state.edgeRule === 'duplicate'}
                                /> Duplicate <br />
                                <input
                                    type="radio"
                                    value="omit"
                                    name="edgeRule"
                                    defaultChecked={this.state.edgeRule === 'omit'}
                                /> Omit <br />
                            </div>

                            {this.state.showScaleMethod && <div>
                                <br/><strong>Scale</strong>
                                <div onChange={this.radioScaleHandler}>
                                    <input
                                        type="radio"
                                        value="proportional"
                                        name="scaleRule"
                                        defaultChecked={this.state.scaleRule === 'proportional'}
                                    /> Proportional <br />
                                    <input
                                        type="radio"
                                        value="trivalent"
                                        name="scaleRule"
                                        defaultChecked={this.state.scaleRule === 'trivalent'}
                                    /> Trivalent <br />
                                    <input
                                        type="radio"
                                        value="trimming"
                                        name="scaleRule"
                                        defaultChecked={this.state.scaleRule === 'trimming'}
                                    /> Trimming <br />
                                </div>
                            </div>}
                        </div>
                        <div className="form-col">
                            <strong>Smooth</strong><br/>
                            {this.preselectedLink(preselected.smoothingStrong, 'smooth', 'strong')}
                            {this.preselectedLink(preselected.smoothingMedium, 'smooth', 'medium')}
                            {this.preselectedLink(preselected.smoothingWeek, 'smooth', 'week')}
                            {this.preselectedLink(preselected.smoothingVeryWeek, 'smooth', 'very week')}

                            <br/><strong>Sharpen</strong><br/>
                            {this.preselectedLink(preselected.sharpenStrong, 'sharpen', 'strong')}
                            {this.preselectedLink(preselected.sharpenMedium, 'sharpen', 'medium')}
                            {this.preselectedLink(preselected.sharpenWeek, 'sharpen', 'week')}
                            {this.preselectedLink(preselected.sharpenVeryWeek, 'sharpen', 'very week')}

                        </div>
                    </div>

                    <br/><input type="submit" value="Apply"/>
                </form>
            </div>
        );
    }
}

export default MaskCombination;
export { maskCombinationTransformation };
