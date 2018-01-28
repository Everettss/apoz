import React, { Component } from 'react';
import './AdaptiveTreshold.css';
import { forEachPixel, flattenMatrix, cloneImage } from '../../../utils/helpers';
import NumericInput from 'react-numeric-input';

const adaptiveTresholdTransformation = (statisticalRule, neighbourhoodRadius, tresholdModificator) => image => {
    const neighbourhoodSize = neighbourhoodRadius * 2 + 1;
    const newImage = cloneImage(image); // you can't mutate image during computation

    let algorithm = arr => {
        let mediumValue;
        let maskFlat = flattenMatrix(arr);
         if (statisticalRule === 'average') {
            mediumValue = maskFlat.reduce((acc,x) => acc + x, 0 ) / maskFlat.length;
         } else {
             let medArray = Math.round(maskFlat.length / 2);
             mediumValue = maskFlat.sort()[medArray];
         }

         mediumValue += tresholdModificator;
        let midArrayIndex = (neighbourhoodSize - (neighbourhoodSize % 2)) / 2 - ((neighbourhoodSize + 1) % 2);

        return arr[midArrayIndex][midArrayIndex] > mediumValue ? 0 : 255;
    };

        let operationOnPixelNeighbours = arr => {
            return algorithm(arr);
        };

    forEachPixel(image, operationOnPixelNeighbours, newImage, {maskHeight: neighbourhoodSize, maskWidth: neighbourhoodSize });

    return {
        title: `adaptive-treshold`,
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

    tresholdModificatorInputHandler() {
        return val => {
            this.setState({ tresholdModificator: val });
        }
    }

    neighbourhoodRadiusInputHandler() {
        return val => {
            this.setState({ neighbourhoodRadius: val });
        }
    }

    formHandler(e) {
        e.preventDefault();
        this.props.updateImage(
            adaptiveTresholdTransformation(this.state.statisticalMethod, this.state.neighbourhoodRadius, this.state.tresholdModificator)
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
                                    onChange={this.neighbourhoodRadiusInputHandler()}
                                />
                            </div>

                            <div>
                                <br/><strong>Treshold modificator:  </strong>
                                <NumericInput
                                    className="filter-inputs__input"
                                    style={false}
                                    min={-255}
                                    max={255}
                                    value={this.state.tresholdModificator}
                                    onChange={this.tresholdModificatorInputHandler()}
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
