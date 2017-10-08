import React, { Component } from 'react';
import _ from 'lodash';
import ndarray from 'ndarray';

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
        const amount = this.state.amount;
        console.log(this.state.amount);

        this.props.updateImage(_image => {
            // console.log(_image);
            // console.log(_image.pick(null, null, null));

            const image = ndarray([..._image.data], [..._image.shape], [..._image.stride]);
            const width = image.shape[0];
            const height = image.shape[1];

            for(let i = 0; i < width; ++i) {
                for(let j = 0; j < height; ++j) {
                    let r = image.get(i, j, 0);
                    let g = image.get(i, j, 1);
                    let b = image.get(i, j, 2);

                    r = r + amount > 255 ? 255 : r + amount;
                    g = g + amount > 255 ? 255 : g + amount;
                    b = b + amount > 255 ? 255 : b + amount;

                    image.set(i, j, 0, r);
                    image.set(i, j, 1, g);
                    image.set(i, j, 2, b);
                }
            }

            return {
                title: `lighten +${amount}` ,
                picture: image
            };
        })
    }
    
    render() {
        return (
            <div>
                <form action="#" onSubmit={this.formHandler}>
                    <input type="range" value={this.state.amount} onChange={this.inputHandler}/>
                    <input type="submit"/>
                </form>
            </div>
        );
    }
}

export default Image;
