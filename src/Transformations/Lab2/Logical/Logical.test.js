
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

    const inputPicture1 = makeTestPicture(input1);
    const inputPicture2 = makeTestPicture(input2);

    describe('OR', () => {
        const expectedOutput =
            [
                [ 0,  0,  0,  0,  0 ],
                [ 0,  0, 14, 14,  0 ],
                [ 0,  0, 14, 12,  2 ],
                [ 2,  0,  0, 14,  0 ],
                [ 0,  0,  0,  0,  0 ]
            ];


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
        // const expectedOutput =
        //     [
        //         [   7,  12,  76, 254 ],
        //         [   2,   6,  40, 254 ],
        //         [  18,   1,  20, 255 ],
        //         [  24,   2,  11, 248 ],
        //     ];

        const expectedOutput = 'TODO make test'; // TODO add real expectedOutput



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
        // const expectedOutput =
        //     [
        //         [   7,  12,  76, 254 ],
        //         [   2,   6,  40, 254 ],
        //         [  18,   1,  20, 255 ],
        //         [  24,   2,  11, 248 ],
        //     ];

        const expectedOutput = 'TODO make test'; // TODO add real expectedOutput


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