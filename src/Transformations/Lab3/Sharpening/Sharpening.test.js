
import { makeTestPicture, getOneChannelArr } from '../../../utils/testHelpers';
import { medianTransformation } from './Median';

describe('median', () => {
    const input =
        [
            [ 15, 15, 14, 13, 14 ],
            [ 14, 14, 13,  0, 12 ],
            [  1,  1, 12, 11, 12 ],
            [  0,  0,  1,  1, 10 ],
            [  0,  0,  0,  0,  1 ]
        ];

    const expectedOutput =
        [
            [ 15, 15, 14, 13, 14 ],
            [ 14, 14, 13, 12, 12 ],
            [  1,  1,  1, 11, 12 ],
            [  0,  0,  1,  1, 10 ],
            [  0,  0,  0,  0,  1 ]
        ];

    const inputPicture = makeTestPicture(input);
    const { picture, title } = medianTransformation('not-modify', { maskWidth: 3, maskHeight: 3 }, 16)(inputPicture);
    const outputPicture = getOneChannelArr(picture);

    it('algorithm', () => {
        expect(outputPicture).toEqual(expectedOutput);
    });

    it('display proper title', () => {
        expect(title).toEqual('median mask:3x3 edge: not-modify');
    })
});
