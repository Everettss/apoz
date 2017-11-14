import React, { Component } from 'react';
import { forEachPixel, cloneImage, filterOutNullsFrom } from '../../../utils/helpers';

const morphologicalTransformation = (edgeRule, maskShape, operation, M = 256) => image => {
    const newImage = cloneImage(image); // you can't mutate image during computation

    let dillate = arr => {
        return Math.max(...arr);
    };
    let erode = arr => {
        return Math.min(...arr);
    };

    let operationOnPixelNeighbours;

    if (operation === 'erode') {
        operationOnPixelNeighbours = arr => {
            return erode(filterOutNullsFrom(arr));
        };
    } else if (operation === 'dillate') {
        operationOnPixelNeighbours = arr => {
            return dillate(filterOutNullsFrom(arr));
        };
    }

    forEachPixel(
        image,
        operationOnPixelNeighbours,
        newImage,
        { maskWidth: 3, maskHeight: 3, type: edgeRule, shape: maskShape }
    );

    return {
        title: `operation ${operation}`,
        picture: newImage
    };
};

class Morphological extends Component {
    constructor(props) {
        super(props);

        this.state = {
            edgeRule: 'not-modify',
            maskShape: 'diamond',
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
                            name="maskShape"
                            defaultChecked={this.state.maskShape === 'diamond'}
                        /> Diamond <br />
                        <input
                            type="radio"
                            value="roberts"
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
