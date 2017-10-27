
import { makeTestPicture, getOneChannelArr } from '../../../utils/testHelpers';
import { sharpeningTransformation } from './Sharpening';

describe('sharpening', () => {
    const input =
        [
            [  2,  5,  6,  2 ],
            [  3,  1,  3,  4 ],
            [  2,  3,  5,  1 ]
        ];


    describe('roberts', () => {
        const expectedOutput =
            [
                [  3,  7,  3,  2 ],
                [  1,  4,  3,  4 ],
                [  2,  3,  5,  1 ]
            ];

        const inputPicture = makeTestPicture(input);
        const {picture, title} = sharpeningTransformation('not-modify', 'roberts', 16)(inputPicture);
        const outputPicture = getOneChannelArr(picture);

        it('algorithm', () => {
            expect(outputPicture).toEqual(expectedOutput);
        });

        it('display proper title', () => {
            expect(title).toEqual('sharpening roberts');
        });
    });

    describe('sobel', () => {
        const input =
            [
                [  3,  4,  2 ],
                [  2,  1,  6 ],
                [  3,  5,  7 ]
            ];

        const expectedOutput =
            [
                [  3,  4,  2 ],
                [  2, 13,  6 ],
                [  3,  5,  7 ]
            ];

        const inputPicture = makeTestPicture(input);
        const {picture, title} = sharpeningTransformation('not-modify', 'sobel', 16)(inputPicture);
        const outputPicture = getOneChannelArr(picture);

        it('algorithm', () => {
            expect(outputPicture).toEqual(expectedOutput);
        });

        it('display proper title', () => {
            expect(title).toEqual('sharpening sobel');
        });
    });
});
