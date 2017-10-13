import React, { Component } from 'react';
import { forEachPixel } from '../../../utils/helpers';

const thresholdTransformation = (level1, level2, M = 256) => image => {
    forEachPixel(image, pixel => {
        return pixel; // TODO implement Threshold with gray levels algorithm
    });

    return {
        title: `threshold with gray (${level1}, ${level2})`,
        picture: image
    };
};

class ThresholdGrayLevels extends Component {
    constructor(props) {
        super(props);
        this.state = { level1: 0, level2: 255 };

        this.inputHandler1 = this.inputHandler1.bind(this);
        this.inputHandler2 = this.inputHandler2.bind(this);
        this.formHandler = this.formHandler.bind(this);
    }

    inputHandler1(e) {
        const level = parseInt(e.target.value, 10);
        if (level < this.state.level2) {
            this.setState({ level1: level });
        }
    }
    inputHandler2(e) {
        const level = parseInt(e.target.value, 10);
        if (this.state.level1 < level) {
            this.setState({ level2: level });
        }
    }

    formHandler(e) {
        e.preventDefault();
        this.props.updateImage(thresholdTransformation(this.state.level1, this.state.level2));
    }

    render() {
        return (
            <div>
                <h3 className="aside__item__title">Threshold with gray levels</h3>
                <form action="#" onSubmit={this.formHandler}>
                    <input
                        type="range"
                        step="1"
                        min="0"
                        max="255"
                        value={this.state.level1}
                        onChange={this.inputHandler1}
                    />
                    level1: {this.state.level1}<br/>
                    <input
                        type="range"
                        step="1"
                        min="0"
                        max="255"
                        value={this.state.level2}
                        onChange={this.inputHandler2}
                    />
                    level2: {this.state.level2}<br/>
                    <input type="submit" value="Apply"/>
                </form>
            </div>
        );
    }
}

export default ThresholdGrayLevels;
export { thresholdTransformation };
