import React, { Component } from 'react';
import { forEachPixel } from '../../../utils/helpers';

const turtleAlgorithm = (M = 256) => image => {
    forEachPixel(image, pixel => pixel); // Do nothing

    return {
        title: 'turtle',
        picture: image
    };
};

class Turtle extends Component {
    constructor(props) {
        super(props);
        this.formHandler = this.formHandler.bind(this);
    }

    formHandler(e) {
        e.preventDefault();
        this.props.updateImage(turtleAlgorithm());
    }

    render() {
        return (
            <div>
                <h3 className="aside__item__title">Turtle Algorithm</h3>
                <form action="#" onSubmit={this.formHandler}>
                    <input type="submit" value="Apply"/>
                </form>
            </div>
        );
    }
}

export default Turtle;
export { turtleAlgorithm };
