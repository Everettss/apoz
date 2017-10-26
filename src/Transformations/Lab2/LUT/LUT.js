import React, { Component } from 'react';
import BezierEditor from 'bezier-easing-editor';
import bezierEasing from 'bezier-easing';
import './LUT.css';
import { forEachPixel } from '../../../utils/helpers';

const DEFAULT_M = 256;
const DEFAULT_CURVE = [0.2, 0.2, 0.8, 0.8];

const lutTransformation = (LUT, M = DEFAULT_M) => {
    return image => {
        forEachPixel(image, pixel => LUT[pixel]);

        return {
            title: 'LUT',
            picture: image
        };
    };
};

class LUT extends Component {
    constructor(props) {
        super(props);
        this.state = { curve: DEFAULT_CURVE };

        this.bezierHandler = this.bezierHandler.bind(this);
        this.formHandler = this.formHandler.bind(this);
    }

    bezierHandler(curve) {
        this.setState({ curve });
    }

    formHandler(e) {
        e.preventDefault();
        const easing = bezierEasing(...this.state.curve);
        let LUT = [];

        for (let i = 0; i < DEFAULT_M; i++) {
            let newVal = Math.round(easing(i / (DEFAULT_M - 1)) * (DEFAULT_M - 1));
            newVal = newVal < DEFAULT_M ? newVal : DEFAULT_M - 1;
            newVal = newVal > -1 ? newVal : 0;
            LUT = [...LUT, newVal];
        }

        this.props.updateImage(lutTransformation(LUT));
    }

    render() {
        return (
            <div>
                <h3 className="aside__item__title">Reduction of gray levels</h3>
                <form action="#" onSubmit={this.formHandler}>
                    <BezierEditor className="bezier" defaultValue={DEFAULT_CURVE} onChange={this.bezierHandler} />
                    <br />
                    <input type="submit" value="Apply"/>
                </form>
            </div>
        );
    }
}

export default LUT;
export { lutTransformation };
