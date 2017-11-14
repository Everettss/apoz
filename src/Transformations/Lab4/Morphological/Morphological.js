import React, { Component } from 'react';
import { forEachPixel, cloneImage, filterOutNullsFrom } from '../../../utils/helpers';

const morphologicalTransformation = (edgeRule, maskShape, operation, M = 256) => image => {
    const newImage = cloneImage(image); // you can't mutate image during computation

    let dilate = arr => {
        return Math.max(...arr);
    };
    let erode = arr => {
        return Math.min(...arr);
    };

    let morph = (inputImg, outputImg, operation) => {
        let operationOnPixelNeighbours = arr => {
            if (operation === 'erode') {
                return erode(filterOutNullsFrom(arr));
            } else if (operation === 'dilate') {
                return dilate(filterOutNullsFrom(arr));
            }
        };

        forEachPixel(
            inputImg,
            operationOnPixelNeighbours,
            outputImg,
            { maskWidth: 3, maskHeight: 3, type: edgeRule, shape: maskShape }
        );
    };


    let temporaryImage;
    switch (operation) {
        case 'open':
            temporaryImage = cloneImage(image);
            morph(image, temporaryImage, 'erode');
            morph(temporaryImage, newImage, 'dilate');
            break;
        case 'close':
            temporaryImage = cloneImage(image);
            morph(temporaryImage, newImage, 'dilate');
            morph(image, temporaryImage, 'erode');
            break;
        default:
            morph(image, newImage, operation);
    }

    return {
        title: `operation ${operation} shape ${maskShape}`,
        picture: newImage
    };
};

class Morphological extends Component {
    constructor(props) {
        super(props);

        this.state = {
            edgeRule: 'not-modify',
            maskShape: 'diamond',
            operation: 'dilate'
        };

        this.radioEdgeHandler = this.radioEdgeHandler.bind(this);
        this.radioElementShapeHandler = this.radioElementShapeHandler.bind(this);
        this.radioOperationHandler = this.radioOperationHandler.bind(this);
        this.formHandler = this.formHandler.bind(this);
    }

    radioEdgeHandler(event) {
        this.setState({ edgeRule: event.target.value });
    }

    radioElementShapeHandler(event) {
        this.setState({ maskShape: event.target.value });
    }

    radioOperationHandler(event) {
        this.setState({ operation: event.target.value });
    }

    formHandler(e) {
        e.preventDefault();
        this.props.updateImage(morphologicalTransformation(this.state.edgeRule, this.state.maskShape, this.state.operation));
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
                            value="dilate"
                            name="operation"
                            defaultChecked={this.state.operation === 'dilate'}
                        /> Dilate <br />
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
                            value="diamond"
                            name="maskShape"
                            defaultChecked={this.state.maskShape === 'diamond'}
                        /> Diamond <br />
                        <input
                            type="radio"
                            value="square"
                            name="maskShape"
                            defaultChecked={this.state.maskShape === 'square'}
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
export { morphologicalTransformation };
