
// TODO I have no idea how they look like
const universalX =
    [
        [undefined, undefined, undefined],
        [undefined, undefined, undefined],
        [undefined, undefined, undefined],
    ];

const universalY =
    [
        [undefined, undefined, undefined],
        [undefined, undefined, undefined],
        [undefined, undefined, undefined],
    ];

const robertsX =
    [
        [  1,  0 ],
        [  0, -1 ],
    ];

const robertsY =
    [
        [  0, -1 ],
        [  1,  0 ],
    ];


const sobelX =
    [
        [ -1,  0,  1 ],
        [ -2,  0,  2 ],
        [ -1,  0,  1 ],
    ];

const sobelY =
    [
        [ -1, -2, -1 ],
        [  0,  0,  0 ],
        [  1,  2,  1 ],
    ];

const prewittX =
    [
        [  1,  0, -1 ],
        [  1,  0, -1 ],
        [  1,  0, -1 ],
    ];

const prewittY =
    [
        [  1,  1,  1 ],
        [  0,  0,  0 ],
        [ -1, -1, -1 ],
    ];

const universal = {
    x: universalX,
    y: universalY,
};

const roberts = {
    x: robertsX,
    y: robertsY,
};

const sobel = {
    x: sobelX,
    y: sobelY,
};

const prewitt = {
    x: prewittX,
    y: prewittY,
};

export {
    universal,
    roberts,
    sobel,
    prewitt,
}
