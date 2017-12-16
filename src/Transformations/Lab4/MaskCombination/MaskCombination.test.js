
import { makeTestPicture, getOneChannelArr } from '../../../utils/testHelpers';
import { maskCombinationTransformation } from './MaskCombination';

//TODO change expected output values
describe('mask combination', () => {
    const input =
        [
            [  2,  5,  6,  2 ],
            [  3,  1,  3,  4 ],
            [  9,  3, 15,  1 ]
        ];

    const smoothingStrong =
        [
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
        ];

    const sharpenStrong =
        [
            [-1, -1, -1],
            [-1,  9, -1],
            [-1, -1, -1],
        ];

    const combinedMasks =
        [
            [  -1,  -2,  -3,  -4,  5, ],
            [  -4,   5,   4,   3,  2, ],
            [   3,   2,   1,   2,  3, ],
            [   2,   3,   4,   5, -4, ],
            [   5,  -4,  -3,  -2, -1, ],
        ];

    describe('one by one', () => {
        const expectedOutput =
            [
                [  2,  5,  6,  2 ],
                [  3,  0,  0,  4 ],
                [  9,  3, 15,  1 ]
            ];

        const inputPicture = makeTestPicture(input);
        const {picture, title} = maskCombinationTransformation('not-modify', 'trimming',
            smoothingStrong, sharpenStrong, combinedMasks, 'one-by-one', 'square')(inputPicture);
        const outputPicture = getOneChannelArr(picture);

        it('algorithm', () => {
            expect(outputPicture).toEqual(expectedOutput);
        });

        it('display proper title', () => {
            expect(title).toEqual('mask combination one-by-one');
        });
    });

    describe('at once', () => {
        const expectedOutput =
            [
                [2, 5, 6, 2],
                [3, 1, 3, 4],
                [9, 3, 15, 1]
            ];

            const inputPicture = makeTestPicture(input);
        const {picture, title} = maskCombinationTransformation('not-modify', 'trimming',
            smoothingStrong, sharpenStrong, combinedMasks, 'at-once', 'square')(inputPicture);
        const outputPicture = getOneChannelArr(picture);

        it('algorithm', () => {
            expect(outputPicture).toEqual(expectedOutput);
        });

        it('display proper title', () => {
            expect(title).toEqual('mask combination at-once');
        });
    });

});
