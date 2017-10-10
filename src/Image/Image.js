import React, { Component } from 'react';
import './Image.css'
import savePixels from 'save-pixels';

class Image extends Component {
    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {
        if (
            !this.props.data ||
            (
                nextProps &&
                nextProps.data &&
                nextProps.data.modificationDate &&
                this.props.data &&
                nextProps.data.modificationDate !== this.props.data.modificationDate
            )
        ) {
            const canvas = savePixels(nextProps.data.picture, 'canvas');
            this.canvasWrapper.innerHTML = '';
            this.canvasWrapper.appendChild(canvas);
        }
    }

    render() {
        return (
            <div className="canvas-wrapper" ref={(canvasWrapper) => { this.canvasWrapper = canvasWrapper; }} />
        );
    }
}

export default Image;
