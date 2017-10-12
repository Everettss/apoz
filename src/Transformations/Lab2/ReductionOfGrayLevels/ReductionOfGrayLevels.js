import React, { Component } from 'react';

const thresholdTransformation = level => image => {
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
        title: `threshold ${level}`,
        picture: image
    };
};

class ReductionOfGrayLevels extends Component {
    constructor(props) {
        super(props);
        this.state = { level: 0 };

        this.inputHandler = this.inputHandler.bind(this);
        this.formHandler = this.formHandler.bind(this);
    }

    inputHandler(e) {
        const level = parseInt(e.target.value, 10);
        this.setState({ level });
    }

    formHandler(e) {
        e.preventDefault();
        this.props.updateImage(thresholdTransformation(this.state.level));
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
                        value={this.state.level}
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
