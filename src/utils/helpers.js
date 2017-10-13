
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

export {
    histogram,
    forEachPixel
}