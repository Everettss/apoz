
import { makeTestPicture, getOneChannelArr } from '../../utils/testHelpers';
import { lightenTransformation } from './Lighten';

describe('lighten', () => {
    const input =
        [[  0,  5, 15 ],
         [  3, 12, 13 ],
         [ 10,  7,  8 ]];

    const expectedOutput =
        [[  2,  7, 15 ],
         [  5, 14, 15 ],
         [ 12,  9, 10 ]];

    const inputPicture = makeTestPicture(input);
    const { picture, title } = lightenTransformation(2, 16)(inputPicture);
    const outputPicture = getOneChannelArr(picture);

    it('algorithm', () => {
        expect(outputPicture).toEqual(expectedOutput);
    });

    it('display proper title', () => {
        expect(title).toEqual('lighten +2');
    })
});
