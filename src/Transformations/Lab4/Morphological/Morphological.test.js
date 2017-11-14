
import { makeTestPicture, getOneChannelArr } from '../../../utils/testHelpers';
import { morphologicalTransformation } from './Morphological';

describe('morphological', () => {
    const input =
        [
            [  2,  5,  6,  2 ],
            [  3,  1,  3,  4 ],
            [  9,  3, 15,  1 ]
        ];


    describe('dilate-square', () => {
        const expectedOutput =
            [
                [5,  6,  6,  6],
                [9, 15, 15, 15],
                [9, 15, 15, 15]
            ];

        const inputPicture = makeTestPicture(input);
        const {picture, title} = morphologicalTransformation('not-modify', 'square', 'dilate', 16)(inputPicture);
        const outputPicture = getOneChannelArr(picture);

        it('algorithm', () => {
            expect(outputPicture).toEqual(expectedOutput);
        });

        it('display proper title', () => {
            expect(title).toEqual('operation dilate shape square');
        });
    });
    describe('dilate-diamond', () => {
        const expectedOutput =
            [
                [5,  6,  6,  6],
                [9,  5, 15,  4],
                [9, 15, 15, 15]
            ];

        const inputPicture = makeTestPicture(input);
        const {picture, title} = morphologicalTransformation('not-modify', 'diamond', 'dilate', 16)(inputPicture);
        const outputPicture = getOneChannelArr(picture);

        it('algorithm', () => {
            expect(outputPicture).toEqual(expectedOutput);
        });

        it('display proper title', () => {
            expect(title).toEqual('operation dilate shape diamond');
        });
    });

    describe('erode-square', () => {
        // [
        //     [  2,  5,  6,  2 ],
        //     [  3,  1,  3,  4 ],
        //     [  9,  3, 15,  1 ]
        // ];

        const expectedOutput =
            [
                [  1,  1,  1,  2 ],
                [  1,  1,  1,  1 ],
                [  1,  1,  1,  1 ]
            ];

        const inputPicture = makeTestPicture(input);
        const {picture, title} = morphologicalTransformation('not-modify', 'square', 'erode', 16)(inputPicture);
        const outputPicture = getOneChannelArr(picture);

        it('algorithm', () => {
            expect(outputPicture).toEqual(expectedOutput);
        });

        it('display proper title', () => {
            expect(title).toEqual('operation erode shape square');
        });
    });

    describe('erode-diamond', () => {

        const expectedOutput =
            [
                [  2,  1,  2,  2 ],
                [  1,  1,  1,  1 ],
                [  3,  1,  1,  1 ]
            ];

        const inputPicture = makeTestPicture(input);
        const {picture, title} = morphologicalTransformation('not-modify', 'diamond', 'erode', 16)(inputPicture);
        const outputPicture = getOneChannelArr(picture);

        it('algorithm', () => {
            expect(outputPicture).toEqual(expectedOutput);
        });

        it('display proper title', () => {
            expect(title).toEqual('operation erode shape diamond');
        });
    });
});
