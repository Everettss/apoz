
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


export {
    histogram
}