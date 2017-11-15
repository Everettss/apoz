import React, { Component } from 'react';
import { forEachPixel, cloneImage, filterOutNullsFrom } from '../../../utils/helpers';

// algorithm: http://yadda.icm.edu.pl/baztech/download/import/contents/BPB2-0005-0099-httpwww_wi_pb_edu_plplikinaukazeszytyz114-saeedrybniktabedzkiadamski.pdf
const skeletonizeTransformation = (edgeRule, maskShape, operation, M = 256) => image => {
    const newImage = cloneImage(image); // you can't mutate image during computation

    let morph = (inputImg, outputImg, operation) => {
        let operationOnPixelNeighbours = arr => {
        };

        forEachPixel(
            inputImg,
            operationOnPixelNeighbours,
            outputImg,
            { maskWidth: 3, maskHeight: 3, type: edgeRule }
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
        title: `skeletonize`,
        picture: newImage
    };
};

class Skeletonize extends Component {
    constructor(props) {
        super(props);

        this.state = {
            edgeRule: 'not-modify'
        };

        this.radioEdgeHandler = this.radioEdgeHandler.bind(this);
        this.formHandler = this.formHandler.bind(this);
    }

    radioEdgeHandler(event) {
        this.setState({ edgeRule: event.target.value });
    }

    formHandler(e) {
        e.preventDefault();
        this.props.updateImage(skeletonizeTransformation(this.state.edgeRule));
    }

    render() {
        return (
            <div>
                <h3 className="aside__item__title">Skeletonize</h3>
                <form action="#" onSubmit={this.formHandler}>
                    Edge
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

export default Skeletonize;
export { skeletonizeTransformation };
