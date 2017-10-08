import React, { Component } from 'react';
import './Image.css'
import savePixels from 'save-pixels';

class Image extends Component {
    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {
        console.log(this.props);
        console.log(nextProps);
        if (nextProps && nextProps.data) {
            const canvas = savePixels(nextProps.data, 'canvas');
            console.log(canvas);
            this.canvasWrapper.innerHTML = '';
            this.canvasWrapper.appendChild(canvas);
        }
    }

    componentDidMount() {
    }

    render() {
        return (
            <div className="canvas-wrapper" ref={(canvasWrapper) => { this.canvasWrapper = canvasWrapper; }} />
        );
    }
}

export default Image;
