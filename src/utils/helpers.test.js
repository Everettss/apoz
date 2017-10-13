
import { makeTestPicture } from './testHelpers';
import { neighbours } from './helpers';

describe('helpers', () => {
    const input =
        [
            [ 15, 15,  0,  3,  2 ],
            [ 12, 13, 15,  0,  1 ],
            [  0,  4,  7, 14, 14 ],
            [  0,  1,  2,  3,  4 ],
            [ 15, 14, 13, 12, 11 ]
        ];

    describe('neighbours', () => {
        it('get form center', () => {
            const expectedOutput = [13, 15, 0, 14, 3, 2, 1, 4];
            const inputPicture = makeTestPicture(input);
            const outputNeighbours = neighbours(inputPicture, 2, 2, 0);
            expect(outputNeighbours).toEqual(expectedOutput);
        });

        it('get top left', () => {
            const expectedOutput = [15, 13, 12];
            const inputPicture = makeTestPicture(input);
            const outputNeighbours = neighbours(inputPicture, 0, 0, 0);
            expect(outputNeighbours).toEqual(expectedOutput);
        });

        it('get top right', () => {
            const expectedOutput = [1, 0, 3];
            const inputPicture = makeTestPicture(input);
            const outputNeighbours = neighbours(inputPicture, 0, 4, 0);
            expect(outputNeighbours).toEqual(expectedOutput);
        });
    });
});
