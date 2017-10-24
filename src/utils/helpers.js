
import _ from 'lodash';

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

const neighbours = (picture, i, j, channel, type = 'omit') => {
    const height = picture.shape[0];
    const width = picture.shape[1];

    // i - 1   g     f     e
    //   i     h     x     d
    // i + 1   a     b     c
    //
    //       j - 1   j   j + 1
    let neighbours = [];

    // g
    if (i - 1 >= 0 && j - 1 >= 0) {
        neighbours = [...neighbours, picture.get(i - 1, j - 1, channel)];
    } else {
        switch (type) {
            case 'omit':
                neighbours = [...neighbours, null];
                break;
            case 'duplicate':
                let duplicated;
                if (i - 1 < 0 && j - 1 < 0) { // top-left
                    duplicated = picture.get(i, j, channel); // x
                } else if (i - 1 < 0 && j - 1 >= 0) {  // top
                    duplicated = picture.get(i, j - 1, channel); // h
                } else if (i - 1 >= 0 && j - 1 < 0) {  // left
                    duplicated = picture.get(i - 1, j, channel); // f
                }
                neighbours = [...neighbours, duplicated];
        }
    }

    // f
    if (i - 1 >= 0) {
        neighbours = [...neighbours, picture.get(i - 1, j, channel)];
    } else {
        switch (type) {
            case 'omit':
                neighbours = [...neighbours, null];
                break;
            case 'duplicate':
                neighbours = [...neighbours, picture.get(i, j, channel)];
        }
    }

    // e
    if (i - 1 >= 0 && j + 1 < width) {
        neighbours = [...neighbours, picture.get(i - 1, j + 1, channel)];
    } else {
        switch (type) {
            case 'omit':
                neighbours = [...neighbours, null];
                break;
            case 'duplicate':
                let duplicated;
                if (i - 1 < 0 && j + 1 >= width) { // top-right
                    duplicated = picture.get(i, j, channel); // x
                } else if (i - 1 < 0 && j + 1 < width) {  // top
                    duplicated = picture.get(i, j + 1, channel); // d
                } else if (i - 1 >= 0 && j + 1 >= width) {  // right
                    duplicated = picture.get(i - 1, j, channel); // f
                }
                neighbours = [...neighbours, duplicated];
        }
    }

    // h
    if (j - 1 >= 0) {
        neighbours = [...neighbours, picture.get(i, j - 1, channel)];
    } else {
        switch (type) {
            case 'omit':
                neighbours = [...neighbours, null];
                break;
            case 'duplicate':
                neighbours = [...neighbours, picture.get(i, j, channel)];
        }
    }

    // x
    neighbours = [...neighbours, picture.get(i, j, channel)];

    // d
    if (j + 1 < width) {
        neighbours = [...neighbours, picture.get(i, j + 1, channel)];
    } else {
        switch (type) {
            case 'omit':
                neighbours = [...neighbours, null];
                break;
            case 'duplicate':
                neighbours = [...neighbours, picture.get(i, j, channel)];
        }
    }

    // a
    if (i + 1 < height && j - 1 >= 0) {
        neighbours = [...neighbours, picture.get(i + 1, j - 1, channel)];
    } else {
        switch (type) {
            case 'omit':
                neighbours = [...neighbours, null];
                break;
            case 'duplicate':
                let duplicated;
                if (i + 1 >= height && j - 1 < 0) { // bottom-left
                    duplicated = picture.get(i, j, channel); // x
                } else if (i + 1 >= height && j - 1 >= 0) {  // bottom
                    duplicated = picture.get(i, j - 1, channel); // h
                } else if (i + 1 < height && j - 1 < 0) {  // left
                    duplicated = picture.get(i + 1, j, channel); // b
                }
                neighbours = [...neighbours, duplicated];
        }
    }

    // b
    if (i + 1 < height) {
        neighbours = [...neighbours, picture.get(i + 1, j, channel)];
    } else {
        switch (type) {
            case 'omit':
                neighbours = [...neighbours, null];
                break;
            case 'duplicate':
                neighbours = [...neighbours, picture.get(i, j, channel)];
        }
    }

    // c
    if (i + 1 < height && j + 1 < width) {
        neighbours = [...neighbours, picture.get(i + 1, j + 1, channel)];
    } else {
        switch (type) {
            case 'omit':
                neighbours = [...neighbours, null];
                break;
            case 'duplicate':
                let duplicated;
                if (i + 1 >= height && j + 1 >= width) { // bottom-right
                    duplicated = picture.get(i, j, channel); // x
                } else if (i + 1 >= height && j + 1 < width) {  // bottom
                    duplicated = picture.get(i, j + 1, channel); // d
                } else if (i + 1 < height && j + 1 >= width) {  // right
                    duplicated = picture.get(i + 1, j, channel); // b
                }
                neighbours = [...neighbours, duplicated];
        }
    }

    const res = [
        neighbours.filter((_, i) => i >= 0 && i < 3),
        neighbours.filter((_, i) => i >= 3 && i < 6),
        neighbours.filter((_, i) => i >= 6 && i < 9),
    ];

    return res;
};

const flattenMatix = matrix => _.flattenDeep(matrix);

const forEachPixel = (picture, fn) => {
    const width = picture.shape[0];
    const height = picture.shape[1];

    for (let i = 0; i < width; ++i) {
        for (let j = 0; j < height; ++j) {
            for (let k = 0; k < 3; ++k) {
                const val = picture.get(i, j, k);
                const newVal = fn(val);
                picture.set(i, j, k, newVal);
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


export {
    histogram,
    forEachPixel,
    forEachPixel2Images,
    neighbours,
    flattenMatix,
}
