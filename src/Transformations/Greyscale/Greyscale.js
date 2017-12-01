import React, { Component } from 'react';

const convertImageToGreyscale = image => {
    const width = image.shape[0];
    const height = image.shape[1];

    for (let i = 0; i < width; ++i) {
        for (let j = 0; j < height; ++j) {
            const bw = (image.get(i, j, 0) + image.get(i, j, 1) + image.get(i, j, 2)) / 3;
            for (let k = 0; k < 3; ++k) {
                image.set(i, j, k, Math.round(bw));
            }
        }
    }
};


const greyscaleTransformation = (M = 256) => image => {
    convertImageToGreyscale(image);

    return {
        title: `greyscale`,
        picture: image
    };
};

class Greyscale extends Component {
    constructor(props) {
        super(props);
        this.formHandler = this.formHandler.bind(this);
    }

    formHandler(e) {
        e.preventDefault();
        this.props.updateImage(greyscaleTransformation());
    }

    render() {
        return (
            <div>
                <h3 className="aside__item__title">Grayscale</h3>
                <form action="#" onSubmit={this.formHandler}>
                    <input type="submit" value="Apply"/>
                </form>
            </div>
        );
    }
}

export default Greyscale;
export { convertImageToGreyscale };
