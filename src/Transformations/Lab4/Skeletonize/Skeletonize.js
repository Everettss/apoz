import React, { Component } from 'react';
import { forEachPixel, cloneImage } from '../../../utils/helpers';

// algorithm: http://yadda.icm.edu.pl/baztech/download/import/contents/BPB2-0005-0099-httpwww_wi_pb_edu_plplikinaukazeszytyz114-saeedrybniktabedzkiadamski.pdf
const skeletonizeTransformation = (edgeRule, M = 256) => image => {
    const newImage = cloneImage(image); // you can't mutate image during computation

    let getMaxValueFromImage = image => {
        const width = image.shape[0];
        const height = image.shape[1];
        var max = -1;
        for (let i = 0; i < width; ++i) {
            for (let j = 0; j < height; ++j) {
                for (let k = 0; k < 3; ++k) {
                    let currentPixel = image.get(i, j, k);
                    if (currentPixel > max)
                        max = currentPixel;
                }
            }
        }
        return max;
    };

    //TODO create algorithm as in link above
    let morph = (inputImg, outputImg, edgeRule) => {

        let operationOnPixelNeighbours = arr => {
            return 1;
        };

        forEachPixel(
            inputImg,
            operationOnPixelNeighbours,
            outputImg,
            {maskWidth: 3, maskHeight: 3, type: edgeRule}
        );

        do {
            forEachPixel(
                inputImg,
                operationOnPixelNeighbours,
                outputImg,
                {maskWidth: 3, maskHeight: 3, type: edgeRule}
            );
        } while (getMaxValueFromImage(outputImg) > 1);
    };

    morph (image, newImage, edgeRule);

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
