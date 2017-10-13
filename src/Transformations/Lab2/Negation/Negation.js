import React, { Component } from 'react';
import { forEachPixel } from '../../../utils/helpers';

const negationTransformation = (M = 256) => image => {
    forEachPixel(image, pixel => {
        return M - 1 - pixel;
    });

    return {
        title: 'negation',
        picture: image
    };
};

class Negation extends Component {
    constructor(props) {
        super(props);
        this.formHandler = this.formHandler.bind(this);
    }

    formHandler(e) {
        e.preventDefault();
        this.props.updateImage(negationTransformation());
    }

    render() {
        return (
            <div>
                <h3 className="aside__item__title">Negation</h3>
                <form action="#" onSubmit={this.formHandler}>
                    <input type="submit" value="Apply"/>
                </form>
            </div>
        );
    }
}

export default Negation;
export { negationTransformation };
