import React, { Component } from 'react';
import './Image.css'
import Modal from 'react-modal';
import savePixels from 'save-pixels';

const getMousePos = (canvas, evt) => {
    let rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left + 20,
        y: evt.clientY - rect.top + 20
    };
};

const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    }
};

class Image extends Component {
    constructor(props) {
        super(props);

        this.state = {
            lineStartPoint: {x: 0, y: 0},
            lineEndPoint: {x: 0, y: 0},
            modalIsOpen: false,
            subimage: null
        };

        this.setLineProfileStartPoint = this.setLineProfileStartPoint.bind(this);
        this.setLineProfileEndPoint = this.setLineProfileEndPoint.bind(this);

        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    setLineProfileStartPoint (ev) {
        let canvas = this.canvasWrapper.childNodes.item(0);
        let clickPoint = getMousePos(canvas, ev);
        this.setState({lineStartPoint: clickPoint});
    }

    setLineProfileEndPoint (ev) {
        let canvas = this.canvasWrapper.childNodes.item(0);
        let clickPoint = getMousePos(canvas, ev);
        let context = canvas.getContext('2d');
        let subImageData = context.getImageData(
            this.state.lineStartPoint.x,
            this.state.lineStartPoint.y,
            clickPoint.x,
            clickPoint.y
        );

        this.setState({
            lineEndPoint: clickPoint,
            modalIsOpen: true,
            subimage: subImageData,
        });
        console.log(subImageData);
    }


    openModal() {
        this.setState({modalIsOpen: true});
    }

    afterOpenModal() {
        // references are now sync'd and can be accessed.
        this.subtitle.style.color = '#f00';
    }

    closeModal() {
        this.setState({modalIsOpen: false});
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
                 ref={(canvasWrapper) => { this.canvasWrapper = canvasWrapper; }} >
                <div>
                    <Modal
                        isOpen={this.state.modalIsOpen}
                        onAfterOpen={this.afterOpenModal}
                        onRequestClose={this.closeModal}
                        style={customStyles}
                        contentLabel="Example Modal">
                        <h2 ref={subtitle => this.subtitle = subtitle}>Hello</h2>
                        <button onClick={this.closeModal}>close</button>
                        <div></div>
                    </Modal>
                </div></div>
        );
    }
}

export default Image;
