import React, { Component } from 'react';
import { forEachPixel } from '../../../utils/helpers';

const thresholdTransformation = (level, M = 256) => image => {
    forEachPixel(image, pixel => {
        return pixel; // TODO implement threshold algorithm
    });

    return {
        title: `threshold ${level}`,
        picture: image
    };
};

class Threshold extends Component {
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
                <h3 className="aside__item__title">Threshold</h3>
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

export default Threshold;
export { thresholdTransformation };
