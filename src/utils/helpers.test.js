
import { makeTestPicture } from './testHelpers';
import { neighbours } from './helpers';

describe('helpers', () => {
    const input =
        [
            [ 11, 15,  0,  3,  2 ],
            [ 12, 13, 15,  0,  1 ],
            [  0,  4,  7, 14, 14 ],
            [  2,  1,  2,  3,  4 ],
        ];

    describe('neighbours', () => {
        describe('ommit', () => {
            it('get form center', () => {
                const expectedOutput =
                    [
                        [15,  0,  3],
                        [13, 15,  0],
                        [4,  7, 14]
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
                        [null, 0,  4],
                        [null, 2,  1],
                        [null, null, null]
                    ];
                const inputPicture = makeTestPicture(input);
                const outputNeighbours = neighbours(inputPicture, 3, 0, 0);
                expect(outputNeighbours).toEqual(expectedOutput);
            });
        });

        describe('duplicate', () => {
            it('get form center', () => {
                const expectedOutput =
                    [
                        [13, 15, 0],
                        [4,  7, 14],
                        [1, 2,  3]
                    ];
                const inputPicture = makeTestPicture(input);
                const outputNeighbours = neighbours(inputPicture, 2, 2, 0, 'duplicate');
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
                const outputNeighbours = neighbours(inputPicture, 0, 0, 0, 'duplicate');
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
                const outputNeighbours = neighbours(inputPicture, 0, 4, 0, 'duplicate');
                expect(outputNeighbours).toEqual(expectedOutput);
            });

            it('get bottom left', () => {
                const expectedOutput =
                    [
                        [0, 0,  4],
                        [2, 2,  1],
                        [2, 2,  1]
                    ];
                const inputPicture = makeTestPicture(input);
                const outputNeighbours = neighbours(inputPicture, 3, 0, 0, 'duplicate');
                expect(outputNeighbours).toEqual(expectedOutput);
            });

            it('get bottom right', () => {
                const expectedOutput =
                    [
                        [14, 14, 14],
                        [ 3,  4,  4],
                        [ 3,  4,  4]
                    ];
                const inputPicture = makeTestPicture(input);
                const outputNeighbours = neighbours(inputPicture, 3, 4, 0, 'duplicate');
                expect(outputNeighbours).toEqual(expectedOutput);
            });
        });
    });
});
