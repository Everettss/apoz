import React, { Component } from 'react';

const reductionOfLevelsTransformation = (level, M = 256) => image => {
    const width = image.shape[0];
    const height = image.shape[1];

    for (let i = 0; i < width; ++i) {
        for (let j = 0; j < height; ++j) {
            let r = image.get(i, j, 0);
            let g = image.get(i, j, 1);
            let b = image.get(i, j, 2);

            // TODO implement Reduction of gray levels algorithm

            image.set(i, j, 0, r);
            image.set(i, j, 1, g);
            image.set(i, j, 2, b);
        }
    }

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
