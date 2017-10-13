
import { makeTestPicture, getOneChannelArr } from '../../../utils/testHelpers';
import { stretchingTransformation } from './Stretching';

describe('Stretching', () => {
    const input =
        [
            [ 15, 15,  0,  0,  2 ],
            [ 13, 13, 15,  0,  0 ],
            [  0,  0,  7, 14, 14 ],
            [  0,  1,  2,  3,  4 ],
            [ 10, 14, 13, 12, 11 ]
        ];

    const expectedOutput =
        [
            [  2,  2,  2,  2,  2 ],
            [ 10, 10,  2,  2,  2 ],
            [  2,  2,  2, 12, 12 ],
            [  2,  2,  2,  2,  2 ],
            [  5, 12,  10,  9,  7 ]
        ];

    // p1 = 10
    // p2 = 14
    // q3 = 5
    // q4 = 12
    // background = 2
    // (p - p1)*((q4-q3)/(p2 - p1)) + q3)

    const inputPicture = makeTestPicture(input);
    const { picture, title } = stretchingTransformation(10, 14, 5, 12, 2, 16)(inputPicture);
    const outputPicture = getOneChannelArr(picture);

    it('algorithm', () => {
        expect(outputPicture).toEqual(expectedOutput);
    });

    it('display proper title', () => {
        expect(title).toEqual('stretching p1:10, p2:14, q3:5, q4:12, background:2');
    })
});

