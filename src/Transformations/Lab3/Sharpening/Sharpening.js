import React, { Component } from 'react';
import * as sharpenMasks from './sharpenMasks';
import { forEachPixel, flattenMatix, cloneImage } from '../../../utils/helpers';

const sharpeningTransformation = (edgeRule, maskType, M = 256) => image => {
    const masks = sharpenMasks[maskType];
    console.log('edgeRule', edgeRule);
    console.log('maskType', maskType);
    console.log('masks', masks);


    const newImage = cloneImage(image); // you can't mutate image during computation

    let operationOnPixelNeighbours;
    if (edgeRule === 'not-modify') {
        operationOnPixelNeighbours = arr => {
            const flattenMask = flattenMatix(arr);
            if (flattenMask.filter(x => x !== null).length < 9) { // missing
                return arr[1][1]; // get center pixel
            } else {
                return arr[1][1]; // TODO implement
            }
        };
    } else {
        operationOnPixelNeighbours = arr => {
            return arr[1][1]; // TODO implement
        };
    }

    forEachPixel(image, operationOnPixelNeighbours, newImage, { type: edgeRule });

    return {
        title: `sharpening ${maskType}`,
        picture: newImage
    };
};

class Sharpening extends Component {
    constructor(props) {
        super(props);

        this.state = {
            edgeRule: 'not-modify',
            maskType: 'universal'
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
        this.props.updateImage(sharpeningTransformation(this.state.edgeRule, this.state.maskType));
    }

    render() {
        return (
            <div>
                <h3 className="aside__item__title">Sharpening</h3>
                <form action="#" onSubmit={this.formHandler}>
                    Mask
                    <div onChange={this.radioMaskTypeHandler}>
                        <input
                            type="radio"
                            value="universal"
                            name="maskType"
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

export default Sharpening;
export { sharpeningTransformation };
