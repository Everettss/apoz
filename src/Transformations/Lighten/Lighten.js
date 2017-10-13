import React, { Component } from 'react';

const lightenTransformation = (amount, M = 256) => image => {
    const width = image.shape[0];
    const height = image.shape[1];

    for (let i = 0; i < width; ++i) {
        for (let j = 0; j < height; ++j) {
            let r = image.get(i, j, 0);
            let g = image.get(i, j, 1);
            let b = image.get(i, j, 2);

            r = r + amount > M - 1 ? M - 1 : r + amount;
            g = g + amount > M - 1 ? M - 1 : g + amount;
            b = b + amount > M - 1 ? M - 1 : b + amount;

            image.set(i, j, 0, r);
            image.set(i, j, 1, g);
            image.set(i, j, 2, b);
        }
    }

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
