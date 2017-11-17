import React, { Component } from 'react';
import {forEachPixel, cloneImage, flattenMatrix} from '../../../utils/helpers';
import { patternB270, patternB180, patternB90, patternB, patternA, patternA90 } from './neighbourhoodPatterns';


////
//// algorithm pseudo code
//remain = true;
//pixels; // original image
//skel; // does match neighbour pattern
//patterns; /// all neighbour patterns
//while remain {
//    remain = false;
//    for (var j in [0, 2, 4 ,6]) {
//        for (var p in pixels) {
//            if (p === 1 && j === 0) {
//                skel = false;
//                for (var neighPattern in patterns) {
//                    if (getNeighbours (p) match neighPattern) {
//                        skel = true;
//                        break;
//                    }
//                }
//
//                p = (skel ? 2 : 3); // for 3 also set remain = true;
//            }
//        }
//        for (var p in pixels) {
//            if (p === 3)
//                p = 0;
//        }
//    }
//}

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

    let checkIfArrayMatchesNeighbourPattern = (arr, pattern) => {
        if (arr.length !== pattern.length || arr[0].length !== pattern[0].length)
            return false;
        var aNonZeroElems = 0;
        var bNonZeroElems =  0;
        var cNonZeroElems =  0;
        var matchesPattern = false;
        var constantsNotMatched = false;

        mainLoop:
        for (var i = 0; i < arr.length; i++) {
            for (var j = 0; j < arr[0].length; j++) {
                let currValue = arr[i][j];
                switch (pattern[i][j]) {
                    case '0':
                        if (currValue !== 0) {
                            constantsNotMatched = true;
                            break mainLoop;
                        }
                        break;
                    case '2':
                        if (currValue !== 2) {
                            constantsNotMatched = true;
                            break mainLoop;
                        }
                        break;
                    case '2+':
                        if (currValue < 2) {
                            constantsNotMatched = true;
                            break mainLoop;
                        }
                        break;
                    case 'A':
                        if (currValue > 0) {
                            aNonZeroElems++;
                        }
                        break;
                    case 'B':
                        if (currValue > 0) {
                            bNonZeroElems++;
                        }
                        break;
                    case 'C':
                        if (currValue > 0) {
                            cNonZeroElems++;
                        }
                        break;
                    default:
                        // do nothing, we are at P - center pixel, or null which is not taken into account
                }
            }
        }

        if (cNonZeroElems > 0) {
            if ( cNonZeroElems === 2 ) {
                matchesPattern = true;
            } else {
                matchesPattern = (aNonZeroElems > 0 && bNonZeroElems > 0);
            }
        } else {
            matchesPattern = (aNonZeroElems > 0 && bNonZeroElems > 0);
        }

        return matchesPattern && !constantsNotMatched;
    };

    let operationOnPixelNeighbours = arr => {
        let output = arr[1][1];
        let flattenImage = flattenMatrix(arr);
        if (output > 0) {
            if ([flattenImage[0], flattenImage[2], flattenImage[4], flattenImage[6]].filter(x => x === 0).length > 0) {
                if (checkIfArrayMatchesNeighbourPattern(arr, patternB) ||
                    checkIfArrayMatchesNeighbourPattern(arr, patternB90) ||
                    checkIfArrayMatchesNeighbourPattern(arr, patternB180) ||
                    checkIfArrayMatchesNeighbourPattern(arr, patternB270)
                ) {
                    output = 2;
                } else {
                    output = 3;
                }
            }
        }

        return output;
    };

    let morph = (inputImg, outputImg, edgeRule, M) => {

        let convertToBinary = arr => {
            return arr[1][1] > M / 2 ? 1 : 0;
        };

        var binaryImg = cloneImage(inputImg);

        // create binary image
        forEachPixel(
            inputImg,
            convertToBinary,
            binaryImg,
            {maskWidth: 3, maskHeight: 3, type: edgeRule}
        );

        var shouldContinue = false;
        do {
            forEachPixel(
                binaryImg,
                operationOnPixelNeighbours,
                outputImg,
                {maskWidth: 3, maskHeight: 3, type: edgeRule, shape: 'square'}
            );

            binaryImg = outputImg;

            shouldContinue = getMaxValueFromImage(outputImg) > 2;

            if (shouldContinue) {
                forEachPixel(
                    binaryImg,
                    function (arr) {return arr[0][0] === 3 ? 0 : arr[0][0]},
                    outputImg,
                    {maskWidth: 1, maskHeight: 1}
                );
            }
        } while (shouldContinue);

        forEachPixel(
            binaryImg,
            function (arr) {return arr[0][0] > 0 ? M - 1 : 0},
            outputImg,
            {maskWidth: 1, maskHeight: 1}
        );
    };

    morph (image, newImage, edgeRule, M);



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
