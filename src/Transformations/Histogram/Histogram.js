import React, { Component } from 'react';
import _ from 'lodash';
import { histogram as histogramHelper } from '../../utils/helpers';


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
            if (rule === 1) {
                newValues[oldLevel] = (leftValues[oldLevel] + rightValues[oldLevel]) / 2;
            } else if (rule === 2) {
                newValues[oldLevel] = rightValues[oldLevel] - leftValues[oldLevel];
            } else if (rule === 3) {
                newValues[oldLevel] = undefined;
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
                    if (rule === 1) {
                        pixelAfterChange = newValues[pixelBeforeChange];
                    } else if (rule === 2) {
                        pixelAfterChange = leftValues[pixelBeforeChange] + Math.random() * newValues[pixelBeforeChange];
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
        this.state = { rule: 1 };
        this.formHandler = this.formHandler.bind(this);
        this.radioHandler = this.radioHandler.bind(this);
    }


    formHandler(e) {
        e.preventDefault();
        this.props.updateImage(histogramTransformation(this.state.rule));
    }

    radioHandler(event) {
        this.setState({ rule: parseInt(event.target.value, 10) })
    }
    
    render() {
        return (
            <div>
                <h3 className="aside__item__title">Histogram</h3>
                <form action="#" onSubmit={this.formHandler}>

                    <div onChange={this.radioHandler}>
                        <input type="radio" value="1" name="type" defaultChecked={this.state.rule === 1}/> 1<br />
                        <input type="radio" value="2" name="type" defaultChecked={this.state.rule === 2}/> 2<br />
                        {/*<input type="radio" value="3" name="type" defaultChecked={this.state.rule === 3}/> 3<br />*/}
                    </div>
                    <input type="submit" value="Apply"/>
                </form>
            </div>
        );
    }
}

export default Image;
