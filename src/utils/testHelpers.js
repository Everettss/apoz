
import ndarrayPack from 'ndarray-pack';
import ndarrayUnpack from 'ndarray-unpack';
import ndarray from 'ndarray';

const makeTestPicture = arr => {
    const allChannelsArr = arr.map(i => i.map(j => [j, j, j, 1]));

    return ndarrayPack(allChannelsArr);
};

const getOneChannelArr = picture => ndarrayUnpack(picture.pick(null, null, 0));

const makeMatrixPrinter = (arr, dimmentions = [5, 5]) => {
    const ndArray = ndarray(new Float64Array(arr), dimmentions);
    console.log(JSON.stringify(ndarrayUnpack(ndArray)));
};

// makeMatrixPrinter([
//
//     0,
//     0,
//     0,
//     0,
//     2,
//     0,
//     0,
//     0,
//     0,
//     0,
//     0,
//     0,
//     7,
//     0,
//     0,
//     0,
//     0,
//     2,
//     3,
//     4,
//     0,
//     0,
//     0,
//     12,
//     11
//
// ]);

export {
    makeTestPicture,
    getOneChannelArr,
    makeMatrixPrinter
}
