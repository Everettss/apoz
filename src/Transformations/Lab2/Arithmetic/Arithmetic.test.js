
import { makeTestPicture, getOneChannelArr } from '../../../utils/testHelpers';
import { arithmeticTransformation } from './Arithmetic';

describe('arithmetic', () => {
    const input1 =
        [
            [   0,  12, 142, 255 ],
            [   1,   6,  40, 254 ],
            [  24,   0,  20, 255 ],
            [  30,   2,  10, 240 ],
        ];

    const input2 =
        [
            [  14,  11,   9, 253 ],
            [   3,   5,  39, 254 ],
            [  11,   1,  19, 255 ],
            [  18,   2,  11, 256 ],
        ];

    describe('add', () => {
        const expectedOutput =
            [
                [   7,  12,  76, 254 ],
                [   2,   6,  40, 254 ],
                [  18,   1,  20, 255 ],
                [  24,   2,  11, 248 ],
            ];

        const inputPicture1 = makeTestPicture(input1);
        const inputPicture2 = makeTestPicture(input2);
        const {picture, title} = arithmeticTransformation('add', 16)(inputPicture1, inputPicture2);
        const outputPicture = getOneChannelArr(picture);

        it('algorithm', () => {
            expect(outputPicture).toEqual(expectedOutput);
        });

        it('display proper title', () => {
            expect(title).toEqual('arithmetic add');
        })
    });

    describe('sub', () => {
        const expectedOutput =
            [
                [  14,   1, 133,  2  ],
                [   2,   1,   1,  0  ],
                [  13,   1,   1,  0  ],
                [  12,   0,   1, 16  ],
            ];

        const inputPicture1 = makeTestPicture(input1);
        const inputPicture2 = makeTestPicture(input2);
        const {picture, title} = arithmeticTransformation('sub', 16)(inputPicture1, inputPicture2);
        const outputPicture2 = getOneChannelArr(picture);

        it('algorithm', () => {
            expect(outputPicture2).toEqual(expectedOutput);
        });

        it('display proper title', () => {
            expect(title).toEqual('arithmetic sub');
        })
    });

    describe('difference', () => {
        const expectedOutput =
            [
                [   0,   0,   0,   0 ],
                [   0,   0,   0,  15 ],
                [   0,   0,   0,  15 ],
                [   0,  15,   0,   0 ],
            ];

        const inputPicture1 = makeTestPicture(input1);
        const inputPicture2 = makeTestPicture(input2);
        const {picture, title} = arithmeticTransformation('difference', 16)(inputPicture1, inputPicture2);
        const outputPicture = getOneChannelArr(picture);

        it('algorithm', () => {
            expect(outputPicture).toEqual(expectedOutput);
        });

        it('display proper title', () => {
            expect(title).toEqual('arithmetic difference');
        })
    });
});
