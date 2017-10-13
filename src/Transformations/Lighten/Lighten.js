import React, { Component } from 'react';

import { forEachPixel } from '../../utils/helpers';

const lightenTransformation = (amount, M = 256) => image => {
    forEachPixel(image, pixel => {
        return pixel + amount > M - 1 ? M - 1 : pixel + amount;
    });

    return {
        title: `lighten +${amount}`,
        picture: image
    };
};

class Image extends Component {
    constructor(props) {
        super(props);
        this.state = { amount: 0 };

        this.inputHandler = this.inputHandler.bind(this);
        this.formHandler = this.formHandler.bind(this);
    }

    inputHandler(e) {
        const amount = parseInt(e.target.value, 10);
        this.setState({ amount });
    }

    formHandler(e) {
        e.preventDefault();
        this.props.updateImage(lightenTransformation(this.state.amount));
    }

    render() {
        return (
            <div>
                <h3 className="aside__item__title">Lighten</h3>
                <form action="#" onSubmit={this.formHandler}>
                    <input type="range" value={this.state.amount} onChange={this.inputHandler}/><br/>
                    <input type="submit" value="Apply"/>
                </form>
            </div>
        );
    }
}

export default Image;
export { lightenTransformation };
