
import { makeTestPicture, getOneChannelArr } from '../../../utils/testHelpers';
import { universalLogicalSmoothTransformation } from './UniversalLogicalSmooth';

describe('universal-logical-smooth', () => {
    const input =
        [
            [ 15, 14, 15, 13, 15 ],
            [ 15, 14, 15, 13, 14 ],
            [  1,  1, 12, 11, 12 ],
            [  0, 14, 12, 13, 10 ],
            [  1,  0,  2,  1, 12 ],
        ];

    describe(0, () => {

        describe('not-modify', () => {

            const expectedOutput =
                [
                    [15, 15, 15, 15, 15],
                    [15, 15, 15, 13, 14],
                    [1, 1, 12, 12, 12],
                    [0, 14, 12, 13, 10],
                    [1, 0, 2, 1, 12]
                ];

            const inputPicture = makeTestPicture(input);
            const { picture, title } = universalLogicalSmoothTransformation('not-modify', 0, 16)(inputPicture);
            const outputPicture = getOneChannelArr(picture);

            it('algorithm', () => {
                expect(outputPicture).toEqual(expectedOutput);
            });

            it('display proper title', () => {
                expect(title).toEqual('rotation: 0 edge: not-modify');
            })
        });

        describe('dim-with-duplicate', () => {

            const expectedOutput =
                [
                    [15, 15, 15, 15, 15],
                    [15, 15, 15, 13, 14],
                    [1, 1, 12, 12, 12],
                    [0, 14, 12, 13, 10],
                    [1, 0, 2, 1, 12]
                ];

            const inputPicture = makeTestPicture(input);
            const { picture, title } = universalLogicalSmoothTransformation('dim-with-duplicate', 0, 16)(inputPicture);
            const outputPicture = getOneChannelArr(picture);

            it('algorithm', () => {
                expect(outputPicture).toEqual(expectedOutput);
            });

            it('display proper title', () => {
                expect(title).toEqual('rotation: 0 edge: dim-with-duplicate');
            })
        });
    });

    describe(90, () => {

        // [
        //     [ 15, 14, 15, 13, 15 ],
        //     [ 15, 14, 15, 13, 14 ],
        //     [  1,  1, 12, 11, 12 ],
        //     [  0, 14, 12, 13, 10 ],
        //     [  1,  0,  2,  1, 12 ],
        // ];

        describe('not-modify', () => {

            const expectedOutput =
                [
                    [15, 14, 15, 13, 15],
                    [15, 14, 15, 13, 14],
                    [1,  14, 12, 13, 12],
                    [1,  14, 12, 13, 12],
                    [1,   0,  2,  1, 12]
                ];

                const inputPicture = makeTestPicture(input);
            const { picture, title } = universalLogicalSmoothTransformation('not-modify', 90, 16)(inputPicture);
            const outputPicture = getOneChannelArr(picture);

            it('algorithm', () => {
                expect(outputPicture).toEqual(expectedOutput);
            });

            it('display proper title', () => {
                expect(title).toEqual('rotation: 90 edge: not-modify');
            })
        });

        describe('dim-with-duplicate', () => {

            const expectedOutput =
                [
                    [15, 14, 15, 13, 15],
                    [15, 14, 15, 13, 14],
                    [1,  14, 12, 13, 12],
                    [1,  14, 12, 13, 12],
                    [1,   0,  2,  1, 12]
                ];

            const inputPicture = makeTestPicture(input);
            const { picture, title } = universalLogicalSmoothTransformation('dim-with-duplicate', 90, 16)(inputPicture);
            const outputPicture = getOneChannelArr(picture);

            it('algorithm', () => {
                expect(outputPicture).toEqual(expectedOutput);
            });

            it('display proper title', () => {
                expect(title).toEqual('rotation: 90 edge: dim-with-duplicate');
            })
        });
    });
});
