import React, { Component } from 'react';
import {cloneImage, forEachPixel} from '../../../utils/helpers';
import { convertImageToGreyscale } from '../../Greyscale/Greyscale';

const segmentationThreshold = (level, rule, M = 256) => image => {
    const newImage = cloneImage(image);

    convertImageToGreyscale(newImage);
    forEachPixel(newImage, (pixelSource, pixelTarget) => {
        if (rule === 'below') {
            return pixelSource < level ? pixelTarget : M - 1;
        } else {
            return pixelSource >= level ? pixelTarget : M - 1;
        }
    }, image);

    return {
        title: `separation threshold ${rule} ${level}`,
        picture: image
    };
};

class SegmentationThreshold extends Component {
    constructor(props) {
        super(props);
        this.state = {
            level: 0,
            rule: 'below',
        };

        this.inputHandler = this.inputHandler.bind(this);
        this.radioRuleHandler = this.radioRuleHandler.bind(this);
        this.formHandler = this.formHandler.bind(this);
    }

    inputHandler(e) {
        const level = parseInt(e.target.value, 10);
        this.setState({ level });
    }

    radioRuleHandler(event) {
        this.setState({ rule: event.target.value });
    }

    formHandler(e) {
        e.preventDefault();
        this.props.updateImage(segmentationThreshold(this.state.level, this.state.rule));
    }

    render() {
        return (
            <div>
                <h3 className="aside__item__title">Segmentation - Threshold</h3>
                <form action="#" onSubmit={this.formHandler}>
                    <input
                        type="range"
                        step="1"
                        min="0"
                        max="255"
                        value={this.state.level}
                        onChange={this.inputHandler}
                    />
                    {this.state.level}<br/>
                    <div onChange={this.radioRuleHandler}>
                        <input
                            type="radio"
                            value="below"
                            name="rule"
                            defaultChecked={this.state.rule === 'below'}
                        /> Image below <br />
                        <input
                            type="radio"
                            value="above"
                            name="rule"
                            defaultChecked={this.state.rule === 'above'}
                        /> Image above <br />
                    </div>
                    <input type="submit" value="Apply"/>
                </form>
            </div>
        );
    }
}

export default SegmentationThreshold;
export { segmentationThreshold };
