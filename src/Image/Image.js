import React, { Component } from 'react';
import './Image.css'
import Modal from 'react-modal';
import savePixels from 'save-pixels';

const getMousePos = (canvas, evt) => {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left + 20,
        y: evt.clientY - rect.top + 20
    };
};

class Image extends Component {
    constructor(props) {
        super(props);

        this.state = {
            lineStartPoint: {x: 0, y: 0},
            lineEndPoint: {x: 0, y: 0},
        };

        this.setLineProfileStartPoint = this.setLineProfileStartPoint.bind(this);
        this.setLineProfileEndPoint = this.setLineProfileEndPoint.bind(this);
    }

    setLineProfileStartPoint (ev) {
        let canvas = this.canvasWrapper.childNodes.item(0);
        let clickPoint = getMousePos(canvas, ev);
        this.setState({lineStartPoint: clickPoint});
        console.log ("ev click on start" + clickPoint.x);
    }

    setLineProfileEndPoint (ev) {
        let canvas = this.canvasWrapper.childNodes.item(0);
        let clickPoint = getMousePos(canvas, ev);
        console.log ("ev click on end" + clickPoint.x);
        this.setState({lineEndPoint: clickPoint});
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
            <div className="canvas-wrapper"
                 onMouseDown={this.setLineProfileStartPoint.bind(this)}
                 onMouseUp={this.setLineProfileEndPoint.bind(this)}
                 ref={(canvasWrapper) => { this.canvasWrapper = canvasWrapper; }} />
        );
    }
}

export default Image;
