
import { makeTestPicture, getOneChannelArr } from '../../../utils/testHelpers';
import { logicalTransformation } from './Logical';

describe('logical', () => {
    const input1 =
        [
            [  0,  0,  0,  1,  0 ],
            [  1,  1, 15, 14,  0 ],
            [  1,  0, 15, 13,  2 ],
            [  2,  1,  0, 14,  0 ],
            [  1,  0,  0,  0,  0 ]
        ];

    const input2 =
        [
            [ 14, 14, 14, 14, 14 ],
            [ 14, 14, 14, 14, 14 ],
            [ 14, 14, 14, 14, 14 ],
            [ 14, 14, 14, 14, 14 ],
            [ 14, 14, 14, 14, 14 ]
        ];

    describe('OR', () => {
        const expectedOutput =
            [
                [ 14, 14, 14, 15, 14 ],
                [ 15, 15, 15, 14, 14 ],
                [ 15, 14, 15, 15, 14 ],
                [ 14, 15, 14, 14, 14 ],
                [ 15, 14, 14, 14, 14 ]
            ];

        const inputPicture1 = makeTestPicture(input1);
        const inputPicture2 = makeTestPicture(input2);
        const {picture, title} = logicalTransformation('OR', 16)(inputPicture1, inputPicture2);
        const outputPicture = getOneChannelArr(picture);

        it('algorithm', () => {
            expect(outputPicture).toEqual(expectedOutput);
        });

        it('display proper title', () => {
            expect(title).toEqual('logical OR');
        })
    });

    describe('AND', () => {
        const expectedOutput =
            [
                [  0,  0,  0,  0,  0 ],
                [  0,  0, 14, 14,  0 ],
                [  0,  0, 14, 12,  2 ],
                [  2,  0,  0, 14,  0 ],
                [  0,  0,  0,  0,  0 ]
            ];

        const inputPicture1 = makeTestPicture(input1);
        const inputPicture2 = makeTestPicture(input2);
        const {picture, title} = logicalTransformation('AND', 16)(inputPicture1, inputPicture2);
        const outputPicture = getOneChannelArr(picture);

        it('algorithm', () => {
            expect(outputPicture).toEqual(expectedOutput);
        });

        it('display proper title', () => {
            expect(title).toEqual('logical AND');
        })
    });

    describe('XOR', () => {
        const expectedOutput =
            [
                [ 14, 14, 14, 15, 14 ],
                [ 15, 15,  1,  0, 14 ],
                [ 15, 14,  1,  3, 12 ],
                [ 12, 15, 14,  0, 14 ],
                [ 15, 14, 14, 14, 14 ]
            ];

        const inputPicture1 = makeTestPicture(input1);
        const inputPicture2 = makeTestPicture(input2);
        const {picture, title} = logicalTransformation('XOR', 16)(inputPicture1, inputPicture2);
        const outputPicture = getOneChannelArr(picture);

        it('algorithm', () => {
            expect(outputPicture).toEqual(expectedOutput);
        });

        it('display proper title', () => {
            expect(title).toEqual('logical XOR');
        })
    });
});
