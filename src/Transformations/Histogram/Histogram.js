import React, { Component } from 'react';
import _ from 'lodash';
import {
    histogram as histogramHelper,
    neighbours,
    flattenMatrix
} from '../../utils/helpers';


const histogramTransformation = rule => image => {
    for (let channel = 0; channel < 3; channel++ ) {
        const histogram = histogramHelper(image, channel);
        const histogramAvg = _.mean(histogram);
        let histogramIntegral = 0;

        const newValues = [];
        const leftValues = [];
        const rightValues = [];
        for (let oldLevel = 0, newLevel = 0; oldLevel < histogram.length; ++oldLevel) {
            leftValues[oldLevel] = rightValues[oldLevel] = newValues[oldLevel] = 0;

            /* 3 */
            leftValues[oldLevel] = newLevel;
            if (histogram[oldLevel] !== 'undefined') {
                histogramIntegral += histogram[oldLevel];
            }

            /* 4 i 5 */
            while (histogramIntegral > histogramAvg) {
                histogramIntegral -= histogramAvg;
                newLevel++;
            }

            /* 6 */
            rightValues[oldLevel] = newLevel;
            if (rule === 'mean') {
                newValues[oldLevel] = (leftValues[oldLevel] + rightValues[oldLevel]) / 2;
            } else if (rule === 'random') {
                newValues[oldLevel] = rightValues[oldLevel] - leftValues[oldLevel];
            }
        }


        const width = image.shape[0];
        const height = image.shape[1];

        for (let i = 0; i < width; ++i) {
            for (let j = 0; j < height; ++j) {
                const pixelBeforeChange = image.get(i, j, channel);
                let pixelAfterChange = 0;

                if (leftValues[pixelBeforeChange] === rightValues[pixelBeforeChange]) {
                    pixelAfterChange = leftValues[pixelBeforeChange];
                } else {
                    if (rule === 'mean') {
                        pixelAfterChange = newValues[pixelBeforeChange];
                    } else if (rule === 'random') {
                        pixelAfterChange = leftValues[pixelBeforeChange] + Math.random() * newValues[pixelBeforeChange];
                    } else if (rule === 'neighbours') {
                        const neighboursArr = flattenMatrix(neighbours(image, i, j, channel)).filter(x => x !== null);
                        const neighboursMean = _.mean(neighboursArr);
                        if (neighboursMean > rightValues[pixelBeforeChange]) {
                            pixelAfterChange = rightValues[pixelBeforeChange];
                        } else if (neighboursMean < leftValues[pixelBeforeChange]) {
                            pixelAfterChange = leftValues[pixelBeforeChange];
                        } else {
                            pixelAfterChange = neighboursMean;
                        }
                    }
                }

                image.set(i, j, channel, Math.round(pixelAfterChange));
            }
        }
    }

    return {
        title: `histogram ${rule}`,
        picture: image
    };
};



class Image extends Component {
    constructor(props) {
        super(props);
        this.state = { rule: 'mean' };
        this.formHandler = this.formHandler.bind(this);
        this.radioHandler = this.radioHandler.bind(this);
    }


    formHandler(e) {
        e.preventDefault();
        this.props.updateImage(histogramTransformation(this.state.rule));
    }

    radioHandler(event) {
        this.setState({ rule: event.target.value })
    }
    
    render() {
        return (
            <div>
                <h3 className="aside__item__title">Histogram</h3>
                <form action="#" onSubmit={this.formHandler}>

                    <div onChange={this.radioHandler}>
                        <input
                            type="radio"
                            value="mean"
                            name="type"
                            defaultChecked={this.state.rule === 'mean'}
                        /> mean<br />
                        <input
                            type="radio"
                            value="random"
                            name="type"
                            defaultChecked={this.state.rule === 'random'}
                        /> random<br />
                        <input
                            type="radio"
                            value="neighbours"
                            name="type"
                            defaultChecked={this.state.rule === 'neighbours'}
                        /> neighbours<br />
                    </div>
                    <input type="submit" value="Apply"/>
                </form>
            </div>
        );
    }
}

export default Image;
