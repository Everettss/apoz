import React, { Component } from 'react';
import { forEachPixel } from '../../../utils/helpers';

const reductionOfLevelsTransformation = (level, M = 256) => image => {
    forEachPixel(image, pixel => {
        return pixel; // TODO implement Reduction of gray levels algorithm
    });

    return {
        title: `reduction to ${level} levels`,
        picture: image
    };
};

class ReductionOfGrayLevels extends Component {
    constructor(props) {
        super(props);
        this.state = { inputVal: 0, level: 0 };

        this.inputHandler = this.inputHandler.bind(this);
        this.formHandler = this.formHandler.bind(this);
    }

    inputHandler(e) {
        const inputVal = parseInt(e.target.value, 10);

        const availableLevels = [2, 4, 8, 16, 32, 64, 128];

        const level = availableLevels.reduce((prev, curr) =>
            (Math.abs(curr - inputVal) < Math.abs(prev - inputVal) ? curr : prev)
        );

        this.setState({ level, inputVal });
    }

    formHandler(e) {
        e.preventDefault();
        this.props.updateImage(reductionOfLevelsTransformation(this.state.level));
    }

    render() {
        return (
            <div>
                <h3 className="aside__item__title">Reduction of gray levels</h3>
                <form action="#" onSubmit={this.formHandler}>
                    <input
                        type="range"
                        step="1"
                        min="0"
                        max="255"
                        value={this.state.inputVal}
                        onChange={this.inputHandler}
                    />
                    {this.state.level}<br/>
                    <input type="submit" value="Apply"/>
                </form>
            </div>
        );
    }
}

export default ReductionOfGrayLevels;
export { reductionOfLevelsTransformation };
