import React, { Component } from 'react';
import './AdaptiveTreshold.css';
import { forEachPixel, flattenMatrix, cloneImage, scale } from '../../../utils/helpers';
import NumericInput from 'react-numeric-input';

const detectMinusValInFilter = arr => !!flattenMatrix(arr).filter(x => x < 0).length;

const adaptiveTresholdTransformation = (statisticalRule, scaleRule, filter, type, M = 256) => image => {

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

        let operationOnPixelNeighbours = arr => {
            return algorithm(arr);
        };

    forEachPixel(image, operationOnPixelNeighbours, newImage, {maskHeight: filter.length, maskWidth: filter[0].length });

    return {
        title: `filter`,
        picture: newImage
    };
};



class AdaptiveTreshold extends Component {
    constructor(props) {
        super(props);

        this.state = {
            statisticalMethod: 'average',
            neighbourhoodRadius: 1,
            tresholdModificator: 0,
        };

        this.radioStaticticalMethodHandler = this.radioStaticticalMethodHandler.bind(this);
        this.neighbourhoodRadiusInputHandler = this.neighbourhoodRadiusInputHandler.bind(this);
        this.tresholdModificatorInputHandler = this.tresholdModificatorInputHandler.bind(this);
        this.formHandler = this.formHandler.bind(this);
    }

    radioStaticticalMethodHandler(event) {
        this.setState({ statisticalMethod: event.target.value });
    }

    tresholdModificatorInputHandler(event) {
        this.setState({ tresholdModificator: event.target.value });
    }

    neighbourhoodRadiusInputHandler(event) {
        this.setState({ neighbourhoodRadius: event.target.value });
    }

    formHandler(e) {
        e.preventDefault();
        this.props.updateImage(
            adaptiveTresholdTransformation(this.state.edgeRule, this.state.scaleRule, this.state.filter, this.state.type)
        );
    }

    render() {
        return (
            <div>
                <h3 className="aside__item__title">Adaptive Treshold</h3>
                <form action="#" onSubmit={this.formHandler}>
                    <div className="form-wrapper">
                        <div className="form-col">
                            <br/><strong>Statistical method</strong>
                            <div onChange={this.radioStaticticalMethodHandler}>
                                <input
                                    type="radio"
                                    value="median"
                                    name="statisticalMethod"
                                    defaultChecked={this.state.statisticalMethod === 'median'}
                                /> Median <br />
                                <input
                                    type="radio"
                                    value="average"
                                    name="statisticalMethod"
                                    defaultChecked={this.state.statisticalMethod === 'average'}
                                /> Average <br />
                            </div>

                            <div>
                                <br/><strong>Neighbourhood radius:  </strong>
                                <NumericInput
                                    className="filter-inputs__input"
                                    style={false}
                                    min={1}
                                    max={255}
                                    value={this.state.neighbourhoodRadius}
                                    onChange={this.neighbourhoodRadiusInputHandler}
                                />
                            </div>

                            <div>
                                <br/><strong>Treshold modificator:  </strong>
                                <NumericInput
                                    className="filter-inputs__input"
                                    style={false}
                                    min={0}
                                    max={255}
                                    value={this.state.tresholdModificator}
                                    onChange={this.tresholdModificatorInputHandler}
                                />
                            </div>
                        </div>
                    </div>
                    <br/><input type="submit" value="Apply"/>
                </form>
            </div>
        );
    }
}

export default AdaptiveTreshold;
export { adaptiveTresholdTransformation };
