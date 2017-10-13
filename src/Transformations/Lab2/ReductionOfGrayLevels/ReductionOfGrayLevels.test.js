
import { makeTestPicture, getOneChannelArr } from '../../../utils/testHelpers';
import { reductionOfLevelsTransformation } from './ReductionOfGrayLevels';

describe('reduction of gray levels', () => {
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
            [ 15, 15,  0,  0,  0 ],
            [ 15, 15, 15,  0,  0 ],
            [  0,  0,  5, 15, 15 ],
            [  0,  0,  0,  0,  5 ],
            [ 15, 15, 15, 10, 10 ]
        ];

    // 4 levels:
    // <  0,  3 ) -> 0
    // <  3,  8 ) -> 5
    // <  8, 13 ) -> 10
    // < 13, 15 ) -> 15
    //

    const inputPicture = makeTestPicture(input);
    const { picture, title } = reductionOfLevelsTransformation(4, 16)(inputPicture);
    const outputPicture = getOneChannelArr(picture);

    it('algorithm', () => {
        expect(outputPicture).toEqual(expectedOutput);
    });

    it('display proper title', () => {
        expect(title).toEqual('reduction to 4 levels');
    })
});
