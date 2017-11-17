
// following masks are neighbour patterns for thinning (skeletonize) operation
const patternA =
    [
        [ null,  null,  null,  null,  null,  null,  null,  null,  null,  null, ],
        [ null,   'A',   'A',   'A',  null,  null,   'A',   'A',   'A',  null, ],
        [ null,   '0',   'P',   '0',  null,  null,   'A',   'P',   '0',  null, ],
        [ null,   'B',   'B',   'B',  null,  null,   'A',   '0',   '2',  null, ],
        [ null,  null,  null,  null,  null,  null,  null,  null,  null,  null, ],
    ];

const patternA90 =
    [
        [null, "A", "0", "B", null],
        [null, "A", "P", "B", null],
        [null, "A", "0", "B", null],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, "A", "A", "A", null],
        [null, "A", "P", "0", null],
        [null, "A", "0", "2", null],
        [null, null, null, null, null]
    ];

const patternB =
    [
        [ 'A', 'A', 'C',  ],
        [ '0', '2', '2+', ],
        [ 'B', 'B', 'C',  ],
    ];

const patternB90 =
    [
        [ 'A', '0', 'B', ],
        [ 'A', '2', 'B', ],
        [ 'C', '2+','C', ],
    ];

const patternB180 =
    [
        [ 'B', 'B', 'C',  ],
        [ '0', '2', '2+', ],
        [ 'A', 'A', 'C',  ],
    ];

const patternB270 =
    [
        [ 'C', '2+','C', ],
        [ 'A', '2', 'B', ],
        [ 'A', '0', 'B', ],
    ];

export {
    patternA,
    patternA90,
    patternB,
    patternB90,
    patternB180,
    patternB270
}
