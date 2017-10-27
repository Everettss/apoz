
import { makeTestPicture, getOneChannelArr } from '../../../utils/testHelpers';
import { universalLogicalSmoothTransformation } from './UniversalLogicalSmooth';

describe('universal-logical-smooth', () => {
    const input =
        [
            [ 15, 15, 14, 13, 14 ],
            [ 14, 14, 13,  0, 12 ],
            [  1,  1, 12, 11, 12 ],
            [  0,  0,  1,  1, 10 ],
            [  0,  0,  0,  0,  1 ]
        ];

    describe('0', () => {

        describe('not-modify', () => {

            const expectedOutput =
                [
                    [ 15, 15, 14, 13, 14 ],
                    [ 14, 14, 13,  0, 12 ],
                    [  1,  1, 12, 11, 12 ],
                    [  0,  0,  1,  1, 10 ],
                    [  0,  0,  0,  0,  1 ]
                ];

            const inputPicture = makeTestPicture(input);
            const { picture, title } = universalLogicalSmoothTransformation('not-modify', '0', 16)(inputPicture);
            const outputPicture = getOneChannelArr(picture);

            it('algorithm', () => {
                expect(outputPicture).toEqual(expectedOutput);
            });

            it('display proper title', () => {
                expect(title).toEqual('rotation: 0 edge: not-modify');
            })
        });

        describe('half-with-duplicate', () => {

            const expectedOutput =
                [
                    [ 15, 15, 14, 13, 14 ],
                    [ 14, 14, 13,  0, 12 ],
                    [  1,  1, 12, 11, 12 ],
                    [  0,  0,  1,  1, 10 ],
                    [  0,  0,  0,  0,  1 ]
                ];

            const inputPicture = makeTestPicture(input);
            const { picture, title } = universalLogicalSmoothTransformation('half-with-duplicate', '0', 16)(inputPicture);
            const outputPicture = getOneChannelArr(picture);

            it('algorithm', () => {
                expect(outputPicture).toEqual(expectedOutput);
            });

            it('display proper title', () => {
                expect(title).toEqual('rotation: 0 edge: half-with-duplicate');
            })
        });
    });

    describe('90', () => {

        describe('not-modify', () => {

            const expectedOutput =
                [
                    [ 15, 15, 14, 13, 14 ],
                    [ 14, 14, 13,  0, 12 ],
                    [  1,  1, 12, 11, 12 ],
                    [  0,  0,  1,  1, 10 ],
                    [  0,  0,  0,  0,  1 ]
                ];

            const inputPicture = makeTestPicture(input);
            const { picture, title } = universalLogicalSmoothTransformation('not-modify', '90', 16)(inputPicture);
            const outputPicture = getOneChannelArr(picture);

            it('algorithm', () => {
                expect(outputPicture).toEqual(expectedOutput);
            });

            it('display proper title', () => {
                expect(title).toEqual('rotation: 90 edge: not-modify');
            })
        });

        describe('half-with-duplicate', () => {

            const expectedOutput =
                [
                    [ 15, 15, 14, 13, 14 ],
                    [ 14, 14, 13,  0, 12 ],
                    [  1,  1, 12, 11, 12 ],
                    [  0,  0,  1,  1, 10 ],
                    [  0,  0,  0,  0,  1 ]
                ];

            const inputPicture = makeTestPicture(input);
            const { picture, title } = universalLogicalSmoothTransformation('half-with-duplicate', '90', 16)(inputPicture);
            const outputPicture = getOneChannelArr(picture);

            it('algorithm', () => {
                expect(outputPicture).toEqual(expectedOutput);
            });

            it('display proper title', () => {
                expect(title).toEqual('rotation: 90 edge: half-with-duplicate');
            })
        });
    });
});
