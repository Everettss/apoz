import React, { Component } from 'react';
import { forEachPixel, flattenMatix, cloneImage } from '../../../utils/helpers';

const universalLogicalSmoothTransformation = (edgeRule, rotationGrade, M = 256) => image => {
    const newImage = cloneImage(image); // you can't mutate image during computation

    let operationOnPixelNeighbours;
    if (rotationGrade === '0') {
        operationOnPixelNeighbours = arr => {
            let oppositePixelsMatch = arr[1][0] === arr [1][2];
            return oppositePixelsMatch ? arr[1][0] : arr[1][1];
        };
    } else {
        operationOnPixelNeighbours = arr => {
                let oppositePixelsMatch = arr[0][1] === arr [2][1];
                return oppositePixelsMatch ? arr[0][1] : arr[1][1];
        };
    }

    forEachPixel(image, operationOnPixelNeighbours, newImage, { ...{maskWidth: 3, maskHeight: 3}, type: edgeRule });

    return {
        title: `rotation: ${rotationGrade} edge: ${edgeRule}`,
        picture: newImage
    };
};

class UniversalLogicalSmooth extends Component {
    constructor(props) {
        super(props);

        this.state = {
            edgeRule: 'not-modify',
            rotationGrade: '0'
        };

        this.radioEdgeHandler = this.radioEdgeHandler.bind(this);
        this.radioMaskHandler = this.radioMaskHandler.bind(this);
        this.formHandler = this.formHandler.bind(this);
    }

    radioEdgeHandler(event) {
        this.setState({ edgeRule: event.target.value });
    }

    radioMaskHandler(event) {

        this.setState({ rotationGrade: event.target.value });
    }

    formHandler(e) {
        e.preventDefault();
        this.props.updateImage(universalLogicalSmoothTransformation(this.state.edgeRule, this.state.maskRule));
    }

    render() {
        return (
            <div>
                <h3 className="aside__item__title">Median</h3>
                <form action="#" onSubmit={this.formHandler}>
                    Rotation
                    <div onChange={this.radioMaskHandler}>
                        <input
                            type="radio"
                            value="0"
                            name="rotationGrade"
                            defaultChecked={this.state.rotationGrade = 0}
                        /> 0 <br />
                        <input
                            type="radio"
                            value="90"
                            name="rotationGrade"
                            defaultChecked={this.state.rotationGrade = 90}
                        /> 90 <br />
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
                        <input
                            type="radio"
                            value="half-with-duplicate"
                            name="edgeRule"
                            defaultChecked={this.state.edgeRule === 'omit'}
                        /> Duplicate and half <br />
                    </div>
                    <br/><input type="submit" value="Apply"/>
                </form>
            </div>
        );
    }
}

export default UniversalLogicalSmooth;
export { universalLogicalSmoothTransformation };

