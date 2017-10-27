import React, { Component } from 'react';
import * as edgesMasks from './edgesMasks';
import { forEachPixel, flattenMatix, cloneImage, fitToRange } from '../../../utils/helpers';

const edgesTransformation = (edgeRule, maskType, M = 256) => image => {
    const newImage = cloneImage(image); // you can't mutate image during computation
    const masks = edgesMasks[maskType];
    const Gx = masks.x;
    const Gy = masks.y;
    const maskHeight = Gx[0].length;
    const maskWidth = Gx.length;
    let midMaskX = (maskWidth - (maskWidth % 2)) / 2 - ((maskWidth + 1) % 2);
    let midMaskY = (maskHeight - (maskHeight % 2)) / 2 - ((maskHeight + 1) % 2);

    let algorithmSum;

    if (maskType === 'roberts') { // I deduced that Roberts is a special case
        algorithmSum = (x, y) => Math.abs(x) + Math.abs(y);
    } else {
        algorithmSum = (x, y) => Math.round(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
    }

    const algorithm = arr => {
        let x = 0;
        let y = 0;

        for (let i = 0; i < maskHeight; i++) {
            for (let j = 0; j < maskHeight; j++) {
                x += Gx[i][j] * arr[i][j];
                y += Gy[i][j] * arr[i][j];
            }
        }

        const res = algorithmSum(x, y);
        return fitToRange(res, 0, M - 1);
    };

    let operationOnPixelNeighbours;
    if (edgeRule === 'not-modify') {
        operationOnPixelNeighbours = arr => {
            const flattenMask = flattenMatix(arr);
            if (flattenMask.filter(x => x !== null).length < maskHeight * maskWidth) { // missing some data
                return arr[midMaskY][midMaskX]; // get center pixel
            } else {
                return algorithm(arr);
            }
        };
    } else {
        operationOnPixelNeighbours = arr => {
            return algorithm(arr);
        };
    }

    forEachPixel(
        image,
        operationOnPixelNeighbours,
        newImage, { maskWidth, maskHeight, type: edgeRule }
    );

    return {
        title: `sharpening ${maskType}`,
        picture: newImage
    };
};

class Edges extends Component {
    constructor(props) {
        super(props);

        this.state = {
            edgeRule: 'not-modify',
            maskType: 'roberts'
        };

        this.radioEdgeHandler = this.radioEdgeHandler.bind(this);
        this.radioMaskTypeHandler = this.radioMaskTypeHandler.bind(this);
        this.formHandler = this.formHandler.bind(this);
    }

    radioEdgeHandler(event) {
        this.setState({ edgeRule: event.target.value });
    }

    radioMaskTypeHandler(event) {
        this.setState({ maskType: event.target.value });
    }

    formHandler(e) {
        e.preventDefault();
        this.props.updateImage(edgesTransformation(this.state.edgeRule, this.state.maskType));
    }

    render() {
        return (
            <div>
                <h3 className="aside__item__title">Edges</h3>
                <form action="#" onSubmit={this.formHandler}>
                    Mask
                    <div onChange={this.radioMaskTypeHandler}>
                        <input
                            type="radio"
                            value="universal"
                            name="maskType"
                            disabled={true}
                            defaultChecked={this.state.maskType === 'universal'}
                        /> Universal <br />
                        <input
                            type="radio"
                            value="roberts"
                            name="maskType"
                            defaultChecked={this.state.maskType === 'roberts'}
                        /> Roberts <br />
                        <input
                            type="radio"
                            value="sobel"
                            name="maskType"
                            defaultChecked={this.state.maskType === 'sobel'}
                        /> Sobel <br />
                        <input
                            type="radio"
                            value="prewitt"
                            name="maskType"
                            defaultChecked={this.state.maskType === 'prewitt'}
                        /> Prewitt <br />
                    </div>
                    <br/>Edge
                    <div onChange={this.radioEdgeHandler}>
                        <input
                            type="radio"
                            value="not-modify"
                            name="edgeRule"
                            defaultChecked={this.state.edgeRule === 'not-modify'}
                        /> Not modify <br />
                        <input
                            type="radio"
                            value="duplicate"
                            name="edgeRule"
                            defaultChecked={this.state.edgeRule === 'duplicate'}
                        /> Duplicate <br />
                        <input
                            type="radio"
                            value="omit"
                            name="edgeRule"
                            defaultChecked={this.state.edgeRule === 'omit'}
                        /> Omit <br />
                    </div>
                    <br/><input type="submit" value="Apply"/>
                </form>
            </div>
        );
    }
}

export default Edges;
export { edgesTransformation };
