import React, { Component } from 'react';

const negationTransformation = image => {
    const width = image.shape[0];
    const height = image.shape[1];

    for (let i = 0; i < width; ++i) {
        for (let j = 0; j < height; ++j) {
            let r = image.get(i, j, 0);
            let g = image.get(i, j, 1);
            let b = image.get(i, j, 2);

            r = 255 - r;
            g = 255 - g;
            b = 255 - b;

            image.set(i, j, 0, r);
            image.set(i, j, 1, g);
            image.set(i, j, 2, b);
        }
    }

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
        this.props.updateImage(negationTransformation);
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
