import React, { Component } from 'react';
import { forEachPixel, flattenMatrix, cloneImage, fitToRange } from '../../../utils/helpers';

const edgesTransformation = (edgeRule, elementShape, M = 256) => image => {
    const newImage = cloneImage(image); // you can't mutate image during computation
    const masks = [];
    const Gx = masks.x;
    const Gy = masks.y;
    const maskHeight = Gx[0].length;
    const maskWidth = Gx.length;
    let midMaskX = (maskWidth - (maskWidth % 2)) / 2 - ((maskWidth + 1) % 2);
    let midMaskY = (maskHeight - (maskHeight % 2)) / 2 - ((maskHeight + 1) % 2);

    let algorithmSum;

    if (elementShape === 'roberts') { // I deduced that Roberts is a special case
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
            const flattenMask = flattenMatrix(arr);
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
        newImage,
        { maskWidth, maskHeight, type: edgeRule }
    );

    return {
        title: `shape ${elementShape}`,
        picture: newImage
    };
};

class Morphological extends Component {
    constructor(props) {
        super(props);

        this.state = {
            edgeRule: 'not-modify',
            elementShape: 'diamond',
            operation: 'dillate'
        };

        this.radioEdgeHandler = this.radioEdgeHandler.bind(this);
        this.radioEdgeHandler = this.radioEdgeHandler.bind(this);
        this.radioOperationHandler = this.radioOperationHandler.bind(this);
        this.formHandler = this.formHandler.bind(this);
    }

    radioEdgeHandler(event) {
        this.setState({ edgeRule: event.target.value });
    }

    radioElementShapeHandler(event) {
        this.setState({ elementShape: event.target.value });
    }

    radioOperationHandler(event) {
        this.setState({ operation: event.target.value });
    }

    formHandler(e) {
        e.preventDefault();
        this.props.updateImage(edgesTransformation(this.state.edgeRule, this.state.elementShape));
    }

    render() {
        return (
            <div>
                <h3 className="aside__item__title">Morphological</h3>
                <form action="#" onSubmit={this.formHandler}>
                    Operation
                    <div onChange={this.radioOperationHandler}>
                        <input
                            type="radio"
                            value="dillate"
                            name="operation"
                            defaultChecked={this.state.operation === 'dillate'}
                        /> Dillate <br />
                        <input
                            type="radio"
                            value="erode"
                            name="operation"
                            defaultChecked={this.state.operation === 'erode'}
                        /> Erode <br />
                        <input
                            type="radio"
                            value="open"
                            name="operation"
                            defaultChecked={this.state.operation === 'open'}
                        /> Open <br />
                        <input
                            type="radio"
                            value="close"
                            name="operation"
                            defaultChecked={this.state.operation === 'close'}
                        /> Close <br />
                    </div>
                    <br/>
                    Element shape
                    <div onChange={this.radioElementShapeHandler}>
                        <input
                            type="radio"
                            value="universal"
                            name="elementShape"
                            defaultChecked={this.state.elementShape === 'diamond'}
                        /> Diamond <br />
                        <input
                            type="radio"
                            value="roberts"
                            name="elementShape"
                            defaultChecked={this.state.elementShape === 'square'}
                        /> Square <br />
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

export default Morphological;
export { edgesTransformation };
