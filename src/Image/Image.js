import React, { Component } from 'react';
import './Image.css'
import Modal from 'react-modal';
import savePixels from 'save-pixels';
import LineProfile from "../LineProfile/LineProfile";

const getMousePos = (canvas, evt) => {
    let rect = canvas.getBoundingClientRect(),
        scaleX = canvas.width / rect.width,
        scaleY = canvas.height / rect.height;
    return {
        x: Math.round((evt.clientX - rect.left) * scaleX),
        y: Math.round((evt.clientY - rect.top) * scaleY)
    };
};

const customStyles = {
    content : {
        top                   : '50%',
        left                  : '30%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-30%',
        transform             : 'translate(-30%, -30%)'
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
        //if modal is open we do not want to react on image click in the background
        if (this.state.modalIsOpen === false) {
            let canvas = this.canvasWrapper.childNodes.item(0);
            let clickPoint = getMousePos(canvas, ev);

            //drawing line showing along what path the LineProfile will be done
            let ctx = canvas.getContext('2d');
            ctx.beginPath();
            ctx.fillStyle = 'rgb(200,0,0)';
            ctx.lineWidth = 5;
            ctx.moveTo(this.state.lineStartPoint.x, this.state.lineStartPoint.y);
            ctx.lineTo(clickPoint.x, clickPoint.y);
            ctx.stroke();

            this.setState({
                lineEndPoint: clickPoint,
                modalIsOpen: true,
            });
        }
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
        const canvas = savePixels(this.state.subimage, 'canvas');
        this.canvasWrapper.innerHTML = '';
        this.canvasWrapper.appendChild(canvas);
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
            this.setState({subimage: nextProps.data.picture});
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
                        appElement={this.canvasWrapper}
                        style={customStyles}
                        contentLabel="Line Profile">
                        <h2 ref={subtitle => this.subtitle = subtitle}>LineProfile</h2>
                        <button onClick={this.closeModal}>close</button>
                        <LineProfile data={this.state.subimage}
                                     startPoint={this.state.lineStartPoint}
                                     endPoint={this.state.lineEndPoint}/>
                    </Modal>
                </div></div>
        );
    }
}

export default Image;
