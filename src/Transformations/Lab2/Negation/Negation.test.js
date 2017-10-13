
import { makeTestPicture, getOneChannelArr } from '../../../utils/testHelpers';
import { negationTransformation } from './Negation';

describe('negation', () => {
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
            [  0,  0, 15, 15, 13 ],
            [  2,  2,  0, 15, 15 ],
            [ 15, 15,  8,  1,  1 ],
            [ 15, 14, 13, 12, 11 ],
            [  0,  1,  2,  3,  4 ]
        ];

    const inputPicture = makeTestPicture(input);
    const { picture, title } = negationTransformation(16)(inputPicture);
    const outputPicture = getOneChannelArr(picture);

    it('algorithm', () => {
        expect(outputPicture).toEqual(expectedOutput);
    });

    it('display proper title', () => {
        expect(title).toEqual('negation');
    })
});
