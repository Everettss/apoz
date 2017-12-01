import React, { Component } from 'react';
import { cloneImage } from '../../../utils/helpers';
import { convertImageToGreyscale } from '../../Greyscale/Greyscale';

const turtleAlgorithm = (M = 256) => image => {
    const newImage = cloneImage(image);

    convertImageToGreyscale(image);

    const width = image.shape[0];
    const height = image.shape[1];

    let x, y;
    let res = '';

    function isPixelBlack(x, y) {
        return image.get(x, y, 0) < M/2;
    }

    let found = false;

    for (x = 0; x < width && !found; x++)
        for (y = height - 1; y >= 0; y--)
            if (isPixelBlack(x, y)) {
                found = true;
                break;
            }

    found = false;
    const startX = x;
    const startY = y;
    let direction = 'UP';
    let isBlack;

    let MAX_OPERATION = 2048*2048;
    let operation = 0;
    while (!found && operation < MAX_OPERATION) {
        operation++;
        isBlack = isPixelBlack(x, y);

        if (isBlack) {
            // Set to hotpink
            newImage.set(x, y, 0, 255);
            newImage.set(x, y, 1, 105);
            newImage.set(x, y, 2, 180);

            // Turn left
            switch (direction) {
                case 'UP':
                    x--;
                    direction = 'LEFT';
                    break;
                case 'RIGHT':
                    y--;
                    direction = 'UP';
                    break;
                case 'DOWN':
                    x++;
                    direction = 'RIGHT';
                    break;
                case 'LEFT':
                    y++;
                    direction = 'DOWN';
                    break;
            }
        } else {
            // Turn right
            switch (direction) {
                case 'UP':
                    x++;
                    direction = 'RIGHT';
                    break;
                case 'RIGHT':
                    y++;
                    direction = 'DOWN';
                    break;
                case 'DOWN':
                    x--;
                    direction = 'LEFT';
                    break;
                case 'LEFT':
                    y--;
                    direction = 'UP';
                    break;
            }
        }

        if (x === startX && y === startY)
            found = true;
        if (x < 0 || x >= width || y < 0 || y >= height) {
            found = false;
        }
    }

    if (operation > MAX_OPERATION) {
        res = 'image too big or something went wrong';
    }

    return {
        title: `turtle ${res}`,
        picture: newImage
    };
};

class Turtle extends Component {
    constructor(props) {
        super(props);
        this.formHandler = this.formHandler.bind(this);
    }

    formHandler(e) {
        e.preventDefault();
        this.props.updateImage(turtleAlgorithm());
    }

    render() {
        return (
            <div>
                <h3 className="aside__item__title">Turtle Algorithm</h3>
                <form action="#" onSubmit={this.formHandler}>
                    <input type="submit" value="Apply"/>
                </form>
            </div>
        );
    }
}

export default Turtle;
export { turtleAlgorithm };
