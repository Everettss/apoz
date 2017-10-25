import React, { Component } from 'react';
import { median } from 'simple-statistics';
import { forEachPixel, flattenMatix } from '../../../utils/helpers';

const medianTransformation = (edgeRule, maskRule, M = 256) => image => {

    let operationOnPixelNeighbours;
    if (edgeRule === 'not-modify') {
        operationOnPixelNeighbours = arr => {
            const flattenMask = flattenMatix(arr);
            if (flattenMask.filter(x => x !== null).length < (maskRule.maskWidth * maskRule.maskHeight)) { // missing
                return arr[(maskRule.maskHeight - 1) / 2][(maskRule.maskWidth - 1) / 2]; // get center pixel
            } else {
                return Math.round(median(flattenMask));
            }
        };
    } else {
        operationOnPixelNeighbours = arr => {
            return Math.round(median(flattenMatix(arr).filter(x => x !== null)));
        };
    }

    forEachPixel(image, operationOnPixelNeighbours, { ...maskRule, type: edgeRule });

    return {
        title: `median mask:${maskRule.maskWidth}x${maskRule.maskHeight} edge: ${edgeRule}`,
        picture: image
    };
};

class Median extends Component {
    constructor(props) {
        super(props);

        this.state = {
            edgeRule: 'not-modify',
            maskRule: { maskWidth: 3, maskHeight: 3 }
        };

        this.radioEdgeHandler = this.radioEdgeHandler.bind(this);
        this.radioMaskHandler = this.radioMaskHandler.bind(this);
        this.formHandler = this.formHandler.bind(this);
    }

    radioEdgeHandler(event) {
        this.setState({ edgeRule: event.target.value });
    }

    radioMaskHandler(event) {
        const mask = event.target.value;
        let maskWidth = 3;
        let maskHeight = 3;

        if (mask === '3x3') {
            maskWidth = 3;
            maskHeight = 3;
        } else if (mask === '3x5') {
            maskWidth = 3;
            maskHeight = 5;
        } else if (mask === '5x3') {
            maskWidth = 5;
            maskHeight = 3;
        } else if (mask === '5x5') {
            maskWidth = 5;
            maskHeight = 5;
        } else if (mask === '7x7') {
            maskWidth = 7;
            maskHeight = 7;
        }

        this.setState({ maskRule: { maskWidth, maskHeight } });
    }

    formHandler(e) {
        e.preventDefault();
        this.props.updateImage(medianTransformation(this.state.edgeRule, this.state.maskRule));
    }

    render() {
        return (
            <div>
                <h3 className="aside__item__title">Median</h3>
                <form action="#" onSubmit={this.formHandler}>
                    Mask
                    <div onChange={this.radioMaskHandler}>
                        <input
                            type="radio"
                            value="3x3"
                            name="maskRule"
                            defaultChecked={this.state.maskRule.maskWidth === 3 && this.state.maskRule.maskHeight === 3}
                        /> 3x3 <br />
                        <input
                            type="radio"
                            value="3x5"
                            name="maskRule"
                            defaultChecked={this.state.maskRule.maskWidth === 3 && this.state.maskRule.maskHeight === 5}
                        /> 3x5 <br />
                        <input
                            type="radio"
                            value="5x3"
                            name="maskRule"
                            defaultChecked={this.state.maskRule.maskWidth === 5 && this.state.maskRule.maskHeight === 3}
                        /> 5x3 <br />
                        <input
                            type="radio"
                            value="5x5"
                            name="maskRule"
                            defaultChecked={this.state.maskRule.maskWidth === 5 && this.state.maskRule.maskHeight === 5}
                        /> 5x5 <br />
                        <input
                            type="radio"
                            value="7x7"
                            name="maskRule"
                            defaultChecked={this.state.maskRule.maskWidth === 7 && this.state.maskRule.maskHeight === 7}
                        /> 7x7 <br />
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

export default Median;
export { medianTransformation };
