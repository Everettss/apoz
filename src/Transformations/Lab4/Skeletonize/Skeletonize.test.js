
import { makeTestPicture, getOneChannelArr } from '../../../utils/testHelpers';
import { skeletonizeTransformation } from './Skeletonize';

describe('skeletonize', () => {
    const input =
        [
            [2,  5,  2,  9,  2,  5,  6,  2 ],
            [2,  5,  9,  9,  2,  5,  6,  2 ],
            [2,  9,  9,  9,  9,  9,  9,  2 ],
            [3,  9,  9,  9,  9,  9,  9,  4 ],
            [2,  9,  9,  9,  9,  9,  9,  2 ],
            [2,  9,  9,  9,  9,  9,  9,  2 ],
            [3,  1,  9,  9,  3,  1,  3,  4 ],
            [9,  3,  9,  9,  9,  3, 15,  1 ]
        ];

    //TODO change it to real output
    const expectedOutput =
        [
            [ 0,   0,   0,  15,   0,   0,   0,  0 ],
            [ 0,   0,  15,  15,   0,   0,   0,  0 ],
            [ 0,  15,  15,  15,  15,  15,  15,  0 ],
            [ 0,  15,  15,  15,  15,  15,  15,  0 ],
            [ 0,  15,  15,  15,  15,  15,  15,  0 ],
            [ 0,  15,  15,  15,  15,  15,  15,  0 ],
            [ 0,   0,  15,  15,   0,   0,   0,  0 ],
            [15,   0,  15,  15,  15,   0,   0,  0 ]
        ];

    const inputPicture = makeTestPicture(input);
    const {picture, title} = skeletonizeTransformation('not-modify', 16)(inputPicture);
    const outputPicture = getOneChannelArr(picture);

    it('algorithm', () => {
        expect(outputPicture).toEqual(expectedOutput);
    });

    it('display proper title', () => {
        expect(title).toEqual('skeletonize');
    });
});
