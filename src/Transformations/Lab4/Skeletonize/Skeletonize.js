import React, { Component } from 'react';
import {forEachPixel, cloneImage, flattenMatrix, neighbours} from '../../../utils/helpers';
import {
    patternB270, patternB180, patternB90, patternB, patternA, patternA90
} from './neighbourhoodPatterns';
import {getOneChannelArr} from "../../../utils/testHelpers";


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


        var remain = true; // 1
        const width = binaryImg.shape[0];
        const height = binaryImg.shape[1];
        var runs = 0;
        while (remain ===  true) { // 2
            remain = false; // 3
            runs++;
            [0, 2, 4 ,6].map (function (neigh) { // 4
                for (let i = 0; i < width; ++i) {        //
                    for (let j = 0; j < height; ++j) {   // 5
                        for (let k = 3; k < 4; ++k) {    //
                            let p = binaryImg.get(i, j, k);
                            let neighMask = neighbours(binaryImg, i, j, k, {});
                            let flattenedMatrix = flattenMatrix(neighMask);
                            let currNeigh = flattenedMatrix[neigh];
                            if (p === 1 && currNeigh === 0) { // 6
                                var skel = false;  // 7
                                    [
                                        patternA,
                                        patternA90,
                                        patternB,
                                        patternB90,
                                        patternB180,
                                        patternB270
                                    ].map(function (neighPattern)
                                { // 8
                                    let newNeighMask = neighbours(binaryImg, i, j, k, {maskWidth: neighPattern[0].length, maskHeight: neighPattern.length});
                                    if (checkIfArrayMatchesNeighbourPattern(newNeighMask, neighPattern)) // 9
                                    {
                                        skel = true;
                                    }
                                });

                                if (skel === true) { //10
                                    binaryImg.set(i, j, k, 2);
                                } else {
                                    binaryImg.set(i, j, k, 0);
                                    remain = true;
                                }
                            }
                        }
                    }
                }
            });

            if (runs > 100)
                remain = false;
        } // 13

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
