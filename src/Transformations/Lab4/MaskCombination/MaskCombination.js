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
            filter: [
                ['', '', ''],
                ['', '', ''],
                ['', '', ''],
            ]
        };

        this.filterInputHandler = this.filterInputHandler.bind(this);
        this.radioEdgeHandler = this.radioEdgeHandler.bind(this);
        this.radioScaleHandler = this.radioScaleHandler.bind(this);
        this.formHandler = this.formHandler.bind(this);
        this.filterUpdateCallback = this.filterUpdateCallback.bind(this);
    }

    radioEdgeHandler(event) {
        this.setState({ edgeRule: event.target.value });
    }

    radioScaleHandler(event) {
        this.setState({ scaleRule: event.target.value });
    }

    filterInputHandler(i, j) {
        return val => {
            const filter = _.cloneDeep(this.state.filter);
            filter[i][j] = val;
            this.setState({ filter, type: 'custom', showScaleMethod: detectMinusValInFilter(filter) });
        }
    }
    handlePreselect(filter, type) {
        return e => {
            e.preventDefault();
            this.setState({ filter, type, showScaleMethod: detectMinusValInFilter(filter) });
        }
    }

    formHandler(e) {
        e.preventDefault();
        this.props.updateImage(
            maskCombinationTransformation(this.state.edgeRule, this.state.scaleRule, this.state.filter, this.state.type)
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

    filterUpdateCallback (newFilter) {
        this.state.filter = newFilter;
    }

    render() {
        return (
            <div>
                <h3 className="aside__item__title">MaskCombination</h3>
                <form action="#" onSubmit={this.formHandler}>
                    <div className="form-wrapper">
                        <div className="form-col">
                            <Mask filter={this.state.filter} callback={this.filterUpdateCallback} />
                            <Mask filter={this.state.filter} callback={this.filterUpdateCallback} />

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
