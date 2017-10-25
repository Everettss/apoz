
const smoothingStrong =
    [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
    ];

const smoothingMedium =
    [
        [1, 1, 1],
        [1, 2, 1],
        [1, 1, 1],
    ];

const smoothingWeek =
    [
        [1, 1, 1],
        [1, 4, 1],
        [1, 1, 1],
    ];

const smoothingVeryWeek =
    [
        [1, 1, 1],
        [1, 16, 1],
        [1, 1, 1],
    ];


const sharpenStrong =
    [
        [-1, -1, -1],
        [-1,  9, -1],
        [-1, -1, -1],
    ];

const sharpenMedium =
    [
        [ 0, -1,  0],
        [-1,  5, -1],
        [ 0, -1,  0],
    ];

const sharpenWeek =
    [
        [ 1, -2,  1],
        [-2,  5, -2],
        [ 1, -2,  1],
    ];

const sharpenVeryWeek =
    [
        [ 0, -1,  0],
        [-1, 20, -1],
        [ 0, -1,  0],
    ];

const edgeHorizontal =
    [
        [  0,  0,  0],
        [ -1,  1,  0],
        [  0,  0,  0],
    ];

const edgeVertical =
    [
        [  0, -1,  0],
        [  0,  1,  0],
        [  0,  0,  0],
    ];

const edgeDiagonal =
    [
        [ -1,  0,  0],
        [  0,  1,  0],
        [  0,  0,  0],
    ];

export {
    smoothingStrong,
    smoothingMedium,
    smoothingWeek,
    smoothingVeryWeek,
    sharpenStrong,
    sharpenMedium,
    sharpenWeek,
    sharpenVeryWeek,
    edgeHorizontal,
    edgeVertical,
    edgeDiagonal,
}
