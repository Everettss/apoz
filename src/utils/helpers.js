
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

const neighbours = (picture, i, j, channel, { maskWidth = 3, maskHeight = 3, type = 'omit' } = {}) => {
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

                default:
                    if (shift.shiftX !== 0 || shift.shiftY !== 0) {
                        neighboursTable[k][l] = null;
                    } else {
                        neighboursTable[k][l] = picture.get (i + yAwayFromMiddle, j + xAwayFromMiddle, channel);
                    }
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

const flattenMatix = matrix => _.flattenDeep(matrix);

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


export {
    histogram,
    forEachPixel,
    forEachPixel2Images,
    neighbours,
    flattenMatix,
    cloneImage,
}
