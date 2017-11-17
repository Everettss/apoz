
import _ from 'lodash';
import ndarray from 'ndarray';

const histogram = (picture, channel) => {
    let hist = new Array(256).fill(0);

    const width = picture.shape[0];
    const height = picture.shape[1];

    for (let i = 0; i < width; ++i) {
        for (let j = 0; j < height; ++j) {
            const val = picture.get(i, j, channel);
            hist[val]++;
        }
    }

    return hist;
};

const neighbours = (picture, i, j, channel, { maskWidth = 3, maskHeight = 3, type = 'omit', shape = 'square' } = {}) => {
    const height = picture.shape[0];
    const width = picture.shape[1];
    let midX = (maskWidth - (maskWidth % 2)) / 2 - ((maskWidth + 1) % 2);
    let midY = (maskHeight - (maskHeight % 2)) / 2 - ((maskHeight + 1) % 2);
    let neighboursTable = new Array(maskHeight).fill(0).map(x => new Array(maskWidth).fill(0));

    // [
    //     [ 11, 15,  0,  3,  2 ],
    //     [ 12, 13, 15,  0,  1 ],
    //     [  0,  4,  7, 14, 14 ],
    //     [  2,  1,  2,  3,  4 ],
    // ]; (0,0) - main point, which means bottom 2 value

    for (let k = 0; k < maskHeight; k++) {
        for (let l = 0; l < maskWidth; l++) {
            let xAwayFromMiddle = l - midX;
            let yAwayFromMiddle = k - midY;
            // width and height - 1, because indexes in table are counted from 0 to max - 1
            let shift = calculateShift(j + xAwayFromMiddle, i + yAwayFromMiddle, width - 1, height - 1);

            switch (type) {
                case 'duplicate':
                    neighboursTable[k][l] = picture.get(i + yAwayFromMiddle + shift.shiftY,
                        j + xAwayFromMiddle + shift.shiftX,
                        channel);
                    break;

                case 'dim-with-duplicate':
                    let pixelAtPoint = picture.get(i + yAwayFromMiddle + shift.shiftY,
                        j + xAwayFromMiddle + shift.shiftX,
                        channel);
                    if (shift.shiftX !== 0 || shift.shiftY !== 0) {
                        neighboursTable[k][l] = Math.round(pixelAtPoint / 1.5);
                    } else {
                        neighboursTable[k][l] = pixelAtPoint;
                    }
                    break;

                default:
                    if (shift.shiftX !== 0 || shift.shiftY !== 0) {
                        neighboursTable[k][l] = null;
                    } else {
                        neighboursTable[k][l] = picture.get (i + yAwayFromMiddle, j + xAwayFromMiddle, channel);
                    }
            }

            switch (shape) {
                case 'diamond':
                    if (xAwayFromMiddle !== 0 && yAwayFromMiddle !== 0) {
                        //for diamond shape we want to have only neighbours on X or Y axis
                        neighboursTable[k][l] = null;
                    }
                    break;

                default:
                    //do nothing
            }

        }
    }

    return neighboursTable;
};

const calculateShift = (x, y, width, height) => {
    let shiftX = 0;
    if (x < 0) {
        shiftX = Math.abs(x); // if lower than 0, we return how much pixels away is zero
    } else if (x > width) {
        shiftX = width - x; // if higher than width, we return how much pixels away is max width value
    }

    let shiftY = 0;
    if(y < 0) {
        shiftY = Math.abs(y);
    } else if (y > height) {
        shiftY = height - y;
    }

    return {shiftX, shiftY}
};

const flattenMatrix = matrix => _.flattenDeep(matrix);

const forEachPixel = (picture, fn, pictureToApply, mask) => {
    const width = picture.shape[0];
    const height = picture.shape[1];

    for (let i = 0; i < width; ++i) {
        for (let j = 0; j < height; ++j) {
            for (let k = 0; k < 3; ++k) {
                let val;
                if (mask) {
                    val = neighbours(picture, i, j, k, mask);
                } else {
                    val = picture.get(i, j, k);
                }

                const newVal = fn(val);
                if (pictureToApply) {
                    pictureToApply.set(i, j, k, newVal);
                } else {
                    picture.set(i, j, k, newVal);
                }
            }
        }
    }
};

const forEachPixel2Images = (picture1, picture2, fn) => {
    const width = picture1.shape[0];
    const height = picture1.shape[1];

    for (let i = 0; i < width; ++i) {
        for (let j = 0; j < height; ++j) {
            for (let k = 0; k < 3; ++k) {
                const val1 = picture1.get(i, j, k);
                const val2 = picture2.get(i, j, k);
                const newVal = fn(val1, val2);
                picture1.set(i, j, k, newVal);
            }
        }
    }
};

const cloneImage = image => ndarray([...image.data], [...image.shape], [...image.stride]);

const fitToRange = (val, start, end) => {
    let newVal = val;
    if (val > end) {
        newVal = end
    } else if (val < start) {
        newVal = start
    }
    return newVal;
};
const scale = (scaleRule, pixelValue, min = 0, M = 256)  => {
    let output;
    switch (scaleRule) {
        case 'proportional':
            // because this algoritm does not work on values < 0
            output = fitToRange( ( (pixelValue - min) / (M - 1 - min) ) * (M - 1), min, M);
            break;

        case 'trivalent':
            if (pixelValue < 0) {
                output = 0;
            } else if (pixelValue > 0) {
                output = M - 1;
            } else {
                output = Math.round( (M - 1) / 2);
            }
            break;

        default: // trimming
            if (pixelValue < 0) {
                output = 0;
            } else if (pixelValue > M - 1) {
                output = M - 1;
            } else {
                output = pixelValue;
            }
            break;

    }

    return output;
};

const resize2DArray = (array, width, height, defaultValue, treatEmptyAsNotExistent = false) => {
    let newArray = new Array(height).fill(defaultValue).map(x => new Array(width).fill(defaultValue));
    let maxHeight = Math.min(array.length, height);

    for (let i = 0; i < maxHeight; i++) {
        newArray[i] = resize1DArray(array[i], width, defaultValue, treatEmptyAsNotExistent);
    }

    return newArray;
};

const resize1DArray = (array, size, defaultValue, treatEmptyAsNotExistent = false) => {
    let newArray = new Array(size).fill(defaultValue);
    let maxLength = Math.min(array.length, size);

    for (let i = 0; i < maxLength; i++) {
        newArray[i] = (array[i] === '' || array[i] === null) && treatEmptyAsNotExistent
            ? defaultValue
            : array[i];
    }

    return newArray;
};

const filterOutNullsFrom = arr => {
    return flattenMatrix(arr).filter(elem => elem !== null);
};

const transposeArray = (arr, degree) => {
    let newArr;
    let newArrayWidth;
    let newArrayHeight;
    let oldArrayHeight = arr.length;
    let oldArrayWidth = arr[0].length;

    switch (degree) {
        case 90:
            newArrayHeight = arr[0].length;
            newArrayWidth = arr.length;
            newArr = new Array(newArrayHeight).fill(0).map(x => new Array(newArrayWidth).fill(0));
            for (var i = 0; i < newArrayHeight; i++) {
                for (var j = 0; j < newArrayWidth; j++) {
                    newArr [i][j] = arr[j][i];
                }
            }
            break;
        case 180:
            newArrayHeight = arr.length;
            newArrayWidth = arr[0].length;
            newArr = new Array(newArrayHeight).fill(0).map(x => new Array(newArrayWidth).fill(0));
            for (var i = 0; i < newArrayHeight; i++) {
                for (var j = 0; j < newArrayWidth; j++) {
                    newArr [i][j] = arr[newArrayHeight - 1 - i][j];
                }
            }
            break;
        case 270:
            newArrayHeight = arr.length;
            newArrayWidth = arr[0].length;
            newArr = new Array(newArrayHeight).fill(0).map(x => new Array(newArrayWidth).fill(0));
            for (var i = 0; i < newArrayHeight; i++) {
                for (var j = 0; j < newArrayWidth; j++) {
                    newArr [i][j] = arr[newArrayHeight - i - 1][newArrayWidth - j - 1];
                }
            }
            break;
        default:
            newArr = arr;
    }
    return newArr;
};

export {
    histogram,
    forEachPixel,
    forEachPixel2Images,
    neighbours,
    flattenMatrix,
    cloneImage,
    fitToRange,
    scale,
    resize1DArray,
    resize2DArray,
    filterOutNullsFrom,
    transposeArray,
}
