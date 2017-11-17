
import { makeTestPicture } from './testHelpers';
import { neighbours, resize1DArray, resize2DArray, transposeArray } from './helpers';

describe('helpers', () => {
    const input =
        [
            [ 11, 15,  0,  3,  2 ],
            [ 12, 13, 15,  0,  1 ],
            [  0,  4,  7, 14, 14 ],
            [  2,  1,  2,  3,  4 ],
        ];

    describe('neighbours', () => {
        describe('3x3', () => {
            describe('ommit', () => {
                it('get form center', () => {
                    const expectedOutput =
                        [
                            [15, 0, 3],
                            [13, 15, 0],
                            [4, 7, 14]
                        ];
                    const inputPicture = makeTestPicture(input);
                    const outputNeighbours = neighbours(inputPicture, 1, 2, 0);
                    expect(outputNeighbours).toEqual(expectedOutput);
                });

                it('get top left', () => {
                    const expectedOutput =
                        [
                            [null, null, null],
                            [null, 11, 15],
                            [null, 12, 13]
                        ];
                    const inputPicture = makeTestPicture(input);
                    const outputNeighbours = neighbours(inputPicture, 0, 0, 0);
                    expect(outputNeighbours).toEqual(expectedOutput);
                });

                it('get top right', () => {
                    const expectedOutput =
                        [
                            [null, null, null],
                            [3, 2, null],
                            [0, 1, null]
                        ];
                    const inputPicture = makeTestPicture(input);
                    const outputNeighbours = neighbours(inputPicture, 0, 4, 0);
                    expect(outputNeighbours).toEqual(expectedOutput);
                });

                it('get bottom left', () => {
                    const expectedOutput =
                        [
                            [null, 0, 4],
                            [null, 2, 1],
                            [null, null, null]
                        ];
                    const inputPicture = makeTestPicture(input);
                    const outputNeighbours = neighbours(inputPicture, 3, 0, 0);
                    expect(outputNeighbours).toEqual(expectedOutput);
                });
            });

            // [
            //     [ 11, 15,  0,  3,  2 ],
            //     [ 12, 13, 15,  0,  1 ],
            //     [  0,  4,  7, 14, 14 ],
            //     [  2,  1,  2,  3,  4 ],
            // ];
            describe('duplicate', () => {
                it('get form center', () => {
                    const expectedOutput =
                        [
                            [13, 15, 0],
                            [4, 7, 14],
                            [1, 2, 3]
                        ];
                    const inputPicture = makeTestPicture(input);
                    const outputNeighbours = neighbours(inputPicture, 2, 2, 0, {type: 'duplicate'});
                    expect(outputNeighbours).toEqual(expectedOutput);
                });

                it('get top left', () => {
                    const expectedOutput =
                        [
                            [11, 11, 15],
                            [11, 11, 15],
                            [12, 12, 13]
                        ];
                    const inputPicture = makeTestPicture(input);
                    const outputNeighbours = neighbours(inputPicture, 0, 0, 0, {type: 'duplicate'});
                    expect(outputNeighbours).toEqual(expectedOutput);
                });

                it('get top right', () => {
                    const expectedOutput =
                        [
                            [3, 2, 2],
                            [3, 2, 2],
                            [0, 1, 1]
                        ];
                    const inputPicture = makeTestPicture(input);
                    const outputNeighbours = neighbours(inputPicture, 0, 4, 0, {type: 'duplicate'});
                    expect(outputNeighbours).toEqual(expectedOutput);
                });

                it('get bottom left', () => {
                    const expectedOutput =
                        [
                            [0, 0, 4],
                            [2, 2, 1],
                            [2, 2, 1]
                        ];
                    const inputPicture = makeTestPicture(input);
                    const outputNeighbours = neighbours(inputPicture, 3, 0, 0, {type: 'duplicate'});
                    expect(outputNeighbours).toEqual(expectedOutput);
                });

                it('get bottom right', () => {
                    const expectedOutput =
                        [
                            [14, 14, 14],
                            [3, 4, 4],
                            [3, 4, 4]
                        ];
                    const inputPicture = makeTestPicture(input);
                    const outputNeighbours = neighbours(inputPicture, 3, 4, 0, {type: 'duplicate'});
                    expect(outputNeighbours).toEqual(expectedOutput);
                });
            });
        });
        // [
        //     [ 11, 15,  0,  3,  2 ],
        //     [ 12, 13, 15,  0,  1 ],
        //     [  0,  4,  7, 14, 14 ],
        //     [  2,  1,  2,  3,  4 ],
        // ];
        describe('2x2', () => {
            describe('ommit', () => {
                it('get form center', () => {
                    const expectedOutput =
                        [
                            [15, 0],
                            [7, 14]
                        ];
                    const inputPicture = makeTestPicture(input);
                    const outputNeighbours = neighbours(inputPicture, 1, 2, 0, { maskWidth: 2, maskHeight: 2 });
                    expect(outputNeighbours).toEqual(expectedOutput);
                });

                it('get bottom right', () => {
                    const expectedOutput =
                        [
                            [    4, null ],
                            [ null, null ]
                        ];
                    const inputPicture = makeTestPicture(input);
                    const outputNeighbours = neighbours(inputPicture, 3, 4, 0, { maskWidth: 2, maskHeight: 2 });
                    expect(outputNeighbours).toEqual(expectedOutput);
                });
            });

            // [
            //     [ 11, 15,  0,  3,  2 ],
            //     [ 12, 13, 15,  0,  1 ],
            //     [  0,  4,  7, 14, 14 ],
            //     [  2,  1,  2,  3,  4 ],
            // ];

            describe('duplicate', () => {
                it('get form center', () => {
                    const expectedOutput =
                        [
                            [15, 0],
                            [7, 14]
                        ];
                    const inputPicture = makeTestPicture(input);
                    const outputNeighbours =
                        neighbours(inputPicture, 1, 2, 0, { maskWidth: 2, maskHeight: 2, type: 'duplicate' });
                    expect(outputNeighbours).toEqual(expectedOutput);
                });

                it('get top right', () => {
                    const expectedOutput =
                        [
                            [ 2, 2 ],
                            [ 1, 1 ]
                        ];
                    const inputPicture = makeTestPicture(input);
                    const outputNeighbours =
                        neighbours(inputPicture, 0, 4, 0, { maskWidth: 2, maskHeight: 2, type: 'duplicate' });
                    expect(outputNeighbours).toEqual(expectedOutput);
                });

                it('get bottom left', () => {
                    const expectedOutput =
                        [
                            [ 2, 1 ],
                            [ 2, 1 ]
                        ];
                    const inputPicture = makeTestPicture(input);
                    const outputNeighbours =
                        neighbours(inputPicture, 3, 0, 0, { maskWidth: 2, maskHeight: 2, type: 'duplicate' });
                    expect(outputNeighbours).toEqual(expectedOutput);
                });

                it('get bottom right', () => {
                    const expectedOutput =
                        [
                            [ 4, 4 ],
                            [ 4, 4 ]
                        ];
                    const inputPicture = makeTestPicture(input);
                    const outputNeighbours =
                        neighbours(inputPicture, 3, 4, 0, { maskWidth: 2, maskHeight: 2, type: 'duplicate' });
                    expect(outputNeighbours).toEqual(expectedOutput);
                });
            });
        });

        describe('3x5', () => {
            // [
            //     [ 11, 15,  0,  3,  2 ],
            //     [ 12, 13, 15,  0,  1 ],
            //     [  0,  4,  7, 14, 14 ],
            //     [  2,  1,  2,  3,  4 ],
            // ];
            describe('ommit', () => {
                it('get form center', () => {
                    const expectedOutput =
                        [
                            [null, null, null],
                            [15, 0, 3],
                            [13, 15, 0],
                            [4, 7, 14],
                            [1,  2,  3]
                        ];
                    const inputPicture = makeTestPicture(input);
                    const outputNeighbours = neighbours(inputPicture, 1, 2, 0, { maskWidth: 3, maskHeight: 5 });
                    expect(outputNeighbours).toEqual(expectedOutput);
                });

                it('get top left', () => {
                    const expectedOutput =
                        [
                            [null, null, null],
                            [null, null, null],
                            [null, 11, 15],
                            [null, 12, 13],
                            [null,  0,  4],
                        ];
                    const inputPicture = makeTestPicture(input);
                    const outputNeighbours = neighbours(inputPicture, 0, 0, 0, { maskWidth: 3, maskHeight: 5 });
                    expect(outputNeighbours).toEqual(expectedOutput);
                });

                it('get top right', () => {
                    const expectedOutput =
                        [
                            [null, null, null],
                            [null, null, null],
                            [3, 2, null],
                            [0, 1, null],
                            [14, 14, null]
                        ];
                    const inputPicture = makeTestPicture(input);
                    const outputNeighbours = neighbours(inputPicture, 0, 4, 0, { maskWidth: 3, maskHeight: 5 });
                    expect(outputNeighbours).toEqual(expectedOutput);
                });

                it('get bottom left', () => {
                    const expectedOutput =
                        [
                            [null, 12, 13],
                            [null, 0, 4],
                            [null, 2, 1],
                            [null, null, null],
                            [null, null, null]
                        ];
                    const inputPicture = makeTestPicture(input);
                    const outputNeighbours = neighbours(inputPicture, 3, 0, 0, { maskWidth: 3, maskHeight: 5 });
                    expect(outputNeighbours).toEqual(expectedOutput);
                });
            });

            // [
            //     [ 11, 15,  0,  3,  2 ],
            //     [ 12, 13, 15,  0,  1 ],
            //     [  0,  4,  7, 14, 14 ],
            //     [  2,  1,  2,  3,  4 ],
            // ];
            describe('duplicate', () => {
                it('get form center', () => {
                    const expectedOutput =
                        [
                            [15, 0, 3],
                            [15, 0, 3],
                            [13, 15, 0],
                            [4, 7, 14],
                            [1,  2,  3]
                        ];
                    const inputPicture = makeTestPicture(input);
                    const outputNeighbours =
                        neighbours(inputPicture, 1, 2, 0, { maskWidth: 3, maskHeight: 5, type: 'duplicate' });
                    expect(outputNeighbours).toEqual(expectedOutput);
                });

                it('get top left', () => {
                    const expectedOutput =
                        [
                            [11, 11, 15],
                            [11, 11, 15],
                            [11, 11, 15],
                            [12, 12, 13],
                            [ 0,  0,  4]
                        ];
                    const inputPicture = makeTestPicture(input);
                    const outputNeighbours =
                        neighbours(inputPicture, 0, 0, 0, { maskWidth: 3, maskHeight: 5, type: 'duplicate' });
                    expect(outputNeighbours).toEqual(expectedOutput);
                });

                it('get top left 1x1 offset', () => {
                    const expectedOutput =
                        [
                            [ 11, 15,  0],
                            [ 11, 15,  0],
                            [ 12, 13, 15],
                            [  0,  4,  7],
                            [  2,  1,  2],
                        ];
                    const inputPicture = makeTestPicture(input);
                    const outputNeighbours =
                        neighbours(inputPicture, 1, 1, 0, { maskWidth: 3, maskHeight: 5, type: 'duplicate' });
                    expect(outputNeighbours).toEqual(expectedOutput);
                });

                it('get top right', () => {
                    const expectedOutput =
                        [
                            [3, 2, 2],
                            [3, 2, 2],
                            [3, 2, 2],
                            [0, 1, 1],
                            [14, 14, 14]
                        ];
                    const inputPicture = makeTestPicture(input);
                    const outputNeighbours =
                        neighbours(inputPicture, 0, 4, 0, { maskWidth: 3, maskHeight: 5, type: 'duplicate' });
                    expect(outputNeighbours).toEqual(expectedOutput);
                });

                it('get top right 1x1 offset', () => {
                    const expectedOutput =
                        [
                            [ 0,  3,  2 ],
                            [ 0,  3,  2 ],
                            [ 15,  0,  1 ],
                            [  7, 14, 14 ],
                            [  2,  3,  4 ]
                        ];
                    const inputPicture = makeTestPicture(input);
                    const outputNeighbours =
                        neighbours(inputPicture, 1, 3, 0, { maskWidth: 3, maskHeight: 5, type: 'duplicate' });
                    expect(outputNeighbours).toEqual(expectedOutput);
                });

                it('get bottom left', () => {
                    const expectedOutput =
                        [
                            [12, 12, 13],
                            [0, 0, 4],
                            [2, 2, 1],
                            [2, 2, 1],
                            [2, 2, 1]
                        ];
                    const inputPicture = makeTestPicture(input);
                    const outputNeighbours =
                        neighbours(inputPicture, 3, 0, 0, { maskWidth: 3, maskHeight: 5, type: 'duplicate' });
                    expect(outputNeighbours).toEqual(expectedOutput);
                });

                it('get bottom left 1x1 offset', () => {
                    const expectedOutput =
                        [
                            [ 11, 15,  0],
                            [ 12, 13, 15],
                            [  0,  4,  7],
                            [  2,  1,  2],
                            [  2,  1,  2],
                        ];
                    const inputPicture = makeTestPicture(input);
                    const outputNeighbours =
                        neighbours(inputPicture, 2, 1, 0, { maskWidth: 3, maskHeight: 5, type: 'duplicate' });
                    expect(outputNeighbours).toEqual(expectedOutput);
                });

                it('get bottom right', () => {
                    const expectedOutput =
                        [
                            [0,  1, 1],
                            [14, 14, 14],
                            [3, 4, 4],
                            [3, 4, 4],
                            [3, 4, 4]
                        ];
                    const inputPicture = makeTestPicture(input);
                    const outputNeighbours =
                        neighbours(inputPicture, 3, 4, 0, { maskWidth: 3, maskHeight: 5, type: 'duplicate' });
                    expect(outputNeighbours).toEqual(expectedOutput);
                });

                it('get bottom right 1x1 offset', () => {
                    const expectedOutput =
                        [
                            [ 0,  3,  2 ],
                            [ 15,  0,  1 ],
                            [ 7, 14, 14 ],
                            [ 2,  3,  4 ],
                            [ 2,  3,  4 ],
                        ];
                    const inputPicture = makeTestPicture(input);
                    const outputNeighbours =
                        neighbours(inputPicture, 2, 3, 0, { maskWidth: 3, maskHeight: 5, type: 'duplicate' });
                    expect(outputNeighbours).toEqual(expectedOutput);
                });
            });
        });

        describe('5x3', () => {
            // [
            //     [ 11, 15,  0,  3,  2 ],
            //     [ 12, 13, 15,  0,  1 ],
            //     [  0,  4,  7, 14, 14 ],
            //     [  2,  1,  2,  3,  4 ],
            // ];
            describe('ommit', () => {
                it('get form center', () => {
                    const expectedOutput =
                        [
                          [ 11, 15,  0,  3,  2 ],
                          [ 12, 13, 15,  0,  1 ],
                          [  0,  4,  7, 14, 14 ],
                        ];
                    const inputPicture = makeTestPicture(input);
                    const outputNeighbours = neighbours(inputPicture, 1, 2, 0, { maskWidth: 5, maskHeight: 3 });
                    expect(outputNeighbours).toEqual(expectedOutput);
                });

                it('get top left', () => {
                    const expectedOutput =
                    [
                        [ null, null, null, null, null ],
                        [ null, null, 11, 15,  0 ],
                        [ null, null, 12, 13, 15 ],
                    ];
                    const inputPicture = makeTestPicture(input);
                    const outputNeighbours = neighbours(inputPicture, 0, 0, 0, { maskWidth: 5, maskHeight: 3 });
                    expect(outputNeighbours).toEqual(expectedOutput);
                });

                it('get top right', () => {
                    const expectedOutput =
                    [
                        [ null, null, null, null, null ],
                        [  0,  3,  2, null, null ],
                        [ 15,  0,  1, null, null ],
                    ];
                    const inputPicture = makeTestPicture(input);
                    const outputNeighbours = neighbours(inputPicture, 0, 4, 0, { maskWidth: 5, maskHeight: 3 });
                    expect(outputNeighbours).toEqual(expectedOutput);
                });

                it('get bottom left', () => {
                    const expectedOutput =
                    [
                        [ null, null, 0,  4,  7 ],
                        [ null, null, 2,  1,  2 ],
                        [ null, null, null, null, null ],
                    ];
                    const inputPicture = makeTestPicture(input);
                    const outputNeighbours = neighbours(inputPicture, 3, 0, 0, { maskWidth: 5, maskHeight: 3 });
                    expect(outputNeighbours).toEqual(expectedOutput);
                });
            });

            // [
            //     [ 11, 15,  0,  3,  2 ],
            //     [ 12, 13, 15,  0,  1 ],
            //     [  0,  4,  7, 14, 14 ],
            //     [  2,  1,  2,  3,  4 ],
            // ];
            describe('duplicate', () => {
                it('get form center', () => {
                    const expectedOutput =
                    [
                        [ 11, 15,  0,  3,  2 ],
                        [ 12, 13, 15,  0,  1 ],
                        [  0,  4,  7, 14, 14 ],
                    ];
                    const inputPicture = makeTestPicture(input);
                    const outputNeighbours =
                        neighbours(inputPicture, 1, 2, 0, { maskWidth: 5, maskHeight: 3, type: 'duplicate' });
                    expect(outputNeighbours).toEqual(expectedOutput);
                });

                it('get top right', () => {
                    const expectedOutput =
                    [
                        [ 0,  3,  2, 2, 2 ],
                        [ 0,  3,  2, 2, 2 ],
                        [15,  0,  1, 1, 1 ],
                    ];
                    const inputPicture = makeTestPicture(input);
                    const outputNeighbours =
                        neighbours(inputPicture, 0, 4, 0, { maskWidth: 5, maskHeight: 3, type: 'duplicate' });
                    expect(outputNeighbours).toEqual(expectedOutput);
                });

                it('get bottom left', () => {
                    const expectedOutput =
                    [
                        [ 0, 0, 0,  4, 7 ],
                        [ 2, 2, 2,  1, 2 ],
                        [ 2, 2, 2,  1, 2 ],
                    ];
                    const inputPicture = makeTestPicture(input);
                    const outputNeighbours =
                        neighbours(inputPicture, 3, 0, 0, { maskWidth: 5, maskHeight: 3, type: 'duplicate' });
                    expect(outputNeighbours).toEqual(expectedOutput);
                });
            });
        });

        describe('5x5', () => {
            // [
            //     [ 11, 15,  0,  3,  2 ],
            //     [ 12, 13, 15,  0,  1 ],
            //     [  0,  4,  7, 14, 14 ],
            //     [  2,  1,  2,  3,  4 ],
            // ];
            describe('ommit', () => {
                it('get form center', () => {
                    const expectedOutput =
                    [
                        [ null, null, null, null, null],
                        [ 11, 15,  0,  3,  2 ],
                        [ 12, 13, 15,  0,  1 ],
                        [  0,  4,  7, 14, 14 ],
                        [  2,  1,  2,  3,  4 ],
                    ];
                    const inputPicture = makeTestPicture(input);
                    const outputNeighbours = neighbours(inputPicture, 1, 2, 0, { maskWidth: 5, maskHeight: 5 });
                    expect(outputNeighbours).toEqual(expectedOutput);
                });

                it('get top left', () => {
                    const expectedOutput =
                [
                    [null, null, null, null, null],
                    [null, null, null, null, null],
                    [null, null, 11, 15, 0],
                    [null, null, 12, 13, 15],
                    [null, null, 0, 4, 7]
                ];
                    const inputPicture = makeTestPicture(input);
                    const outputNeighbours = neighbours(inputPicture, 0, 0, 0, { maskWidth: 5, maskHeight: 5 });
                    expect(outputNeighbours).toEqual(expectedOutput);
                });

                it('get bottom right', () => {
                    const expectedOutput =
                    [
                        [15, 0, 1, null, null],
                        [7, 14, 14, null, null],
                        [2, 3, 4, null, null],
                        [null, null, null, null, null],
                        [null, null, null, null, null]
                    ];
                    const inputPicture = makeTestPicture(input);
                    const outputNeighbours = neighbours(inputPicture, 3, 4, 0, { maskWidth: 5, maskHeight: 5 });
                    expect(outputNeighbours).toEqual(expectedOutput);
                });
            });

            // [
            //     [ 11, 15,  0,  3,  2 ],
            //     [ 12, 13, 15,  0,  1 ],
            //     [  0,  4,  7, 14, 14 ],
            //     [  2,  1,  2,  3,  4 ],
            // ];
            describe('duplicate', () => {
                it('get form center', () => {
                    const expectedOutput =
                        [
                            [ 11, 15,  0,  3,  2 ],
                            [ 11, 15,  0,  3,  2 ],
                            [ 12, 13, 15,  0,  1 ],
                            [  0,  4,  7, 14, 14 ],
                            [  2,  1,  2,  3,  4 ],
                        ];
                    const inputPicture = makeTestPicture(input);
                    const outputNeighbours =
                        neighbours(inputPicture, 1, 2, 0, { maskWidth: 5, maskHeight: 5, type: 'duplicate' });
                    expect(outputNeighbours).toEqual(expectedOutput);
                });

                it('get top left', () => {
                    const expectedOutput =
                        [
                            [11, 11, 11, 15, 0],
                            [11, 11, 11, 15, 0],
                            [11, 11, 11, 15, 0],
                            [12, 12, 12, 13, 15],
                            [0, 0, 0, 4, 7]
                        ];
                    const inputPicture = makeTestPicture(input);
                    const outputNeighbours =
                        neighbours(inputPicture, 0, 0, 0, { maskWidth: 5, maskHeight: 5, type: 'duplicate' });
                    expect(outputNeighbours).toEqual(expectedOutput);
                });
            });
        });

        describe('7x7', () => {
            // [
            //     [ 11, 15,  0,  3,  2 ],
            //     [ 12, 13, 15,  0,  1 ],
            //     [  0,  4,  7, 14, 14 ],
            //     [  2,  1,  2,  3,  4 ],
            // ];
            describe('ommit', () => {
                it('get form center', () => {
                    const expectedOutput =
                        [
                            [ null, null, null,  null,  null,  null, null ],
                            [ null, null, null,  null,  null,  null, null ],
                            [ null, 11, 15,  0,  3,  2, null ],
                            [ null, 12, 13, 15,  0,  1, null ],
                            [ null,  0,  4,  7, 14, 14, null ],
                            [ null,  2,  1,  2,  3,  4, null ],
                            [ null, null, null,  null,  null,  null, null ],
                        ];
                    const inputPicture = makeTestPicture(input);
                    const outputNeighbours = neighbours(inputPicture, 1, 2, 0, { maskWidth: 7, maskHeight: 7 });
                    expect(outputNeighbours).toEqual(expectedOutput);
                });

                it('get top right', () => {
                    const expectedOutput =
                        [
                            [null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null],
                            [15, 0, 3, 2, null, null, null],
                            [13, 15, 0, 1, null, null, null],
                            [4, 7, 14, 14, null, null, null],
                            [1, 2, 3, 4, null, null, null]
                        ];
                    const inputPicture = makeTestPicture(input);
                    const outputNeighbours = neighbours(inputPicture, 0, 4, 0, { maskWidth: 7, maskHeight: 7 });
                    expect(outputNeighbours).toEqual(expectedOutput);
                });

                it('get bottom left', () => {
                    const expectedOutput =
                        [
                            [null, null, null, 11, 15, 0, 3],
                            [null, null, null, 12, 13, 15, 0],
                            [null, null, null, 0, 4, 7, 14],
                            [null, null, null, 2, 1, 2, 3],
                            [null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null]
                        ];
                    const inputPicture = makeTestPicture(input);
                    const outputNeighbours = neighbours(inputPicture, 3, 0, 0, { maskWidth: 7, maskHeight: 7 });
                    expect(outputNeighbours).toEqual(expectedOutput);
                });
            });

            // [
            //     [ 11, 15,  0,  3,  2 ],
            //     [ 12, 13, 15,  0,  1 ],
            //     [  0,  4,  7, 14, 14 ],
            //     [  2,  1,  2,  3,  4 ],
            // ];
            describe('duplicate', () => {
                it('get form center', () => {
                    const expectedOutput =
                    [
                        [  11, 11, 15,  0,  3,  2,  2 ],
                        [  11, 11, 15,  0,  3,  2,  2 ],
                        [  11, 11, 15,  0,  3,  2,  2 ],
                        [  12, 12, 13, 15,  0,  1,  1 ],
                        [   0,  0,  4,  7, 14, 14, 14 ],
                        [   2,  2,  1,  2,  3,  4,  4 ],
                        [   2,  2,  1,  2,  3,  4,  4 ],
                    ];
                    const inputPicture = makeTestPicture(input);
                    const outputNeighbours =
                        neighbours(inputPicture, 1, 2, 0, { maskWidth: 7, maskHeight: 7, type: 'duplicate' });
                    expect(outputNeighbours).toEqual(expectedOutput);
                });

                it('get top left', () => {
                    const expectedOutput =
                        [
                            [11, 11, 11, 11, 15, 0, 3],
                            [11, 11, 11, 11, 15, 0, 3],
                            [11, 11, 11, 11, 15, 0, 3],
                            [11, 11, 11, 11, 15, 0, 3],
                            [12, 12, 12, 12, 13, 15, 0],
                            [0, 0, 0, 0, 4, 7, 14],
                            [2, 2, 2, 2, 1, 2, 3]
                        ];
                    const inputPicture = makeTestPicture(input);
                    const outputNeighbours =
                        neighbours(inputPicture, 0, 0, 0, { maskWidth: 7, maskHeight: 7, type: 'duplicate' });
                    expect(outputNeighbours).toEqual(expectedOutput);
                });

                it('get bottom right', () => {
                    const expectedOutput =
                        [
                          [15, 0, 3, 2, 2, 2, 2],
                          [13, 15, 0, 1, 1, 1, 1],
                          [4, 7, 14, 14, 14, 14, 14],
                          [1, 2, 3, 4, 4, 4, 4],
                          [1, 2, 3, 4, 4, 4, 4],
                          [1, 2, 3, 4, 4, 4, 4],
                          [1, 2, 3, 4, 4, 4, 4]
                        ];
                    const inputPicture = makeTestPicture(input);
                    const outputNeighbours =
                        neighbours(inputPicture, 3, 4, 0, { maskWidth: 7, maskHeight: 7, type: 'duplicate' });
                    expect(outputNeighbours).toEqual(expectedOutput);
                });
            });
        });
    });

    describe('arrayResize', () => {
        describe('1D', () => {
            const oneDimensionInput =
                [
                    15, 0, 3,
                ];
                it('bigger array', () => {
                    const expectedOutput =
                        [
                            15, 0, 3, 0, 0,
                        ];
                    const outputArray = resize1DArray(oneDimensionInput, 5, 0);
                    expect(outputArray).toEqual(expectedOutput);
                });

                it('smaller array', () => {
                    const expectedOutput =
                        [
                            15, 0,
                        ];
                    const outputArray = resize1DArray(oneDimensionInput, 2, 0);
                    expect(outputArray).toEqual(expectedOutput);
                });

                it('same size array', () => {
                    const expectedOutput =
                        [
                            15, 0, 3,
                        ];
                    const outputArray = resize1DArray(oneDimensionInput, 3, 0);
                    expect(outputArray).toEqual(expectedOutput);
                });
            });
        describe('2D', () => {
            const twoDimensionInput =
                [
                    [15, 0,  3, ],
                    [ 4, 9,  7, ],
                    [ 5, 4, 30, ],
                ];
            it('bigger array', () => {
                const expectedOutput =
                    [
                        [15, 0,  3, 0, 0, ],
                        [ 4, 9,  7, 0, 0, ],
                        [ 5, 4, 30, 0, 0, ],
                        [ 0, 0,  0, 0, 0, ],
                        [ 0, 0,  0, 0, 0, ],
                    ];
                const outputArray = resize2DArray(twoDimensionInput, 5, 5, 0);
                expect(outputArray).toEqual(expectedOutput);
            });

            it('smaller array', () => {
                const expectedOutput =
                    [
                        [15, 0, ],
                        [ 4, 9, ],
                    ];
                const outputArray = resize2DArray(twoDimensionInput, 2, 2, 0);
                expect(outputArray).toEqual(expectedOutput);
            });

            it('same size array', () => {
                const expectedOutput =
                    [
                        [15, 0,  3, ],
                        [ 4, 9,  7, ],
                        [ 5, 4, 30, ],
                    ];
                const outputArray = resize2DArray(twoDimensionInput, 3, 3, 0);
                expect(outputArray).toEqual(expectedOutput);
            });

            it('irregular size array 1', () => {
                const expectedOutput =
                    [
                        [15, 0,  3, 99, 99, ],
                        [ 4, 9,  7, 99, 99, ],
                        [ 5, 4, 30, 99, 99, ],
                        [ 99, 99, 99, 99, 99, ],
                    ];
                const outputArray = resize2DArray(twoDimensionInput, 5, 4, 99);
                expect(outputArray).toEqual(expectedOutput);
            });

            it('irregular size array 2', () => {
                const expectedOutput =
                    [
                        [15, 0, ],
                        [ 4, 9, ],
                        [ 5, 4, ],
                        [ 77, 77, ],
                        [ 77, 77, ],
                        [ 77, 77, ],
                    ];
                const outputArray = resize2DArray(twoDimensionInput, 2, 6, 77);
                expect(outputArray).toEqual(expectedOutput);
            });

            const inputWithEmptyValues =
                [
                    [15, 0,  '', ],
                    [ 4, '',  7, ],
                    [ null, 4, 30, ],
                ];

            it('same size array with swapping empty values', () => {
                const expectedOutput =
                    [
                        [15, 0,  1, ],
                        [ 4, 1,  7, ],
                        [ 1, 4, 30, ],
                    ];
                const outputArray = resize2DArray(inputWithEmptyValues, 3, 3, 1, true);
                expect(outputArray).toEqual(expectedOutput);
            });
        });
    });

    describe('transposeArray', () => {
        const unevenSizeInput =
            [
                [ 15, 0, 3, ],
                [  5, 3, 7, ],
                [  6, 7, 9, ],
                [ 12, 3, 1, ],
                [  2, 0, 8, ],
            ];
        const evenSizeInput =
            [
                [ 15, 0, 3, ],
                [  5, 3, 7, ],
                [  2, 0, 8, ],
            ];

        describe('180 degrees', () => {
            it('3x3', () => {
                const expectedoutput =
                    [
                        [  2, 0, 8, ],
                        [  5, 3, 7, ],
                        [ 15, 0, 3, ],
                    ];
                const outputarray = transposeArray(evenSizeInput, 180);
                expect(outputarray).toEqual(expectedoutput);
            });
            it('3x5', () => {
                const expectedoutput =
                    [
                        [  2, 0, 8, ],
                        [ 12, 3, 1, ],
                        [  6, 7, 9, ],
                        [  5, 3, 7, ],
                        [ 15, 0, 3, ],
                    ];
                const outputarray = transposeArray(unevenSizeInput, 180);
                expect(outputarray).toEqual(expectedoutput);
            });
        });

        describe('90 degrees', () => {
            it('3x3', () => {
                const expectedoutput =
                    [
                        [ 15, 5, 2, ],
                        [  0, 3, 0, ],
                        [  3, 7, 8, ],
                    ];
                const outputarray = transposeArray(evenSizeInput, 90);
                expect(outputarray).toEqual(expectedoutput);
            });
            it('3x5', () => {
                const expectedoutput =
                    [
                        [ 15, 5, 6, 12, 2, ],
                        [  0, 3, 7,  3, 0, ],
                        [  3, 7, 9,  1, 8, ],
                    ];
                const outputarray = transposeArray(unevenSizeInput, 90);
                expect(outputarray).toEqual(expectedoutput);
            });
        });
    });
});
