
import { makeTestPicture, getOneChannelArr } from '../../../utils/testHelpers';
import { thresholdTransformation } from './ThresholdGrayLevels';

describe('Threshold with gray levels', () => {
    const input =
        [
            [ 15, 15,  0,  0,  2 ],
            [ 13, 13, 15,  0,  0 ],
            [  0,  0,  7, 14, 14 ],
            [  0,  1,  2,  3,  4 ],
            [ 15, 14, 13, 12, 11 ]
        ];

    const expectedOutput =
        [
            [  0,  0,  0,  0,  2 ],
            [  0,  0,  0,  0,  0 ],
            [  0,  0,  7,  0,  0 ],
            [  0,  0,  2,  3,  4 ],
            [  0,  0,  0, 12, 11 ]
        ];

    const inputPicture = makeTestPicture(input);
    const { picture, title } = thresholdTransformation(2, 12, 16)(inputPicture);
    const outputPicture = getOneChannelArr(picture);

    it('algorithm', () => {
        expect(outputPicture).toEqual(expectedOutput);
    });

    it('display proper title', () => {
        expect(title).toEqual('threshold with gray (2, 12)');
    })
});
