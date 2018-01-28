import React, { Component } from 'react';
import './Image.css'
import Modal from 'react-modal';
import savePixels from 'save-pixels';
import 'svg.js';
import 'svg.draggable.js';
import ReactResizeDetector from 'react-resize-detector';
import LineProfile from "../LineProfile/LineProfile";


const HANDLER_RADIUS = 8;

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
            lineStartPoint: {x: 20, y: 40},
            lineEndPoint: {x: 70, y: 100},
            modalIsOpen: false,
            subimage: null
        };

        this.draw = null;
        this.w = 0;
        this.h = 0;

        this.setLineProfileStartPoint = this.setLineProfileStartPoint.bind(this);
        this.setLineProfileEndPoint = this.setLineProfileEndPoint.bind(this);

        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this._onResize = this._onResize.bind(this);
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

    _onResize(w, h) {
        this.w = this.canvas ? this.canvas.offsetWidth : 0;
        this.h = this.canvas ? this.canvas.offsetHeight : 0;
        this.wReal = this.canvas ? parseFloat(this.canvas.getAttribute('width')) : 0;
        this.hReal = this.canvas ? parseFloat(this.canvas.getAttribute('height')) : 0;
        if (this.draw) {
            this.draw.size(w + HANDLER_RADIUS * 2, h + HANDLER_RADIUS * 2)
        }
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
            this.canvas = canvas;
            this.canvasWrapper.innerHTML = '';
            this.canvasWrapper.appendChild(canvas);
            this.setState({subimage: nextProps.data.picture});


            this.w = this.canvas ? this.canvas.offsetWidth : 0;
            this.h = this.canvas ? this.canvas.offsetHeight : 0;
            this.wReal = this.canvas ? parseFloat(this.canvas.getAttribute('width')) : 0;
            this.hReal = this.canvas ? parseFloat(this.canvas.getAttribute('height')) : 0;



            const _this = this;



            const draw = window
                .SVG(this.lineEditorWrapper)
                .size(_this.w + HANDLER_RADIUS * 2, _this.h + HANDLER_RADIUS * 2);
            this.draw = draw;

            const line = draw
                .line(
                    _this.state.lineStartPoint.x / _this.wReal * _this.w + HANDLER_RADIUS,
                    _this.state.lineStartPoint.y / _this.hReal * _this.h + HANDLER_RADIUS,
                    _this.state.lineEndPoint.x / _this.wReal * _this.w + HANDLER_RADIUS,
                    _this.state.lineEndPoint.y / _this.hReal * _this.h + HANDLER_RADIUS
                )
                .stroke({ width: 2, color: 'red' });

            const makeHandler = (stateHandler) => {

                const handler = draw
                    .circle(HANDLER_RADIUS * 2)
                    .move(
                        _this.state[stateHandler].x / _this.wReal * _this.w,
                        _this.state[stateHandler].y / _this.hReal * _this.h
                    )
                    .attr({ fill: 'blue' });

                handler.draggable(function (x, y) {
                    const position = {
                        x: (this.cx() - HANDLER_RADIUS) * _this.wReal / _this.w,
                        y: (this.cy() - HANDLER_RADIUS) * _this.hReal / _this.h,
                    };

                    _this.setState({ [stateHandler]: {
                            x: parseInt(position.x, 10),
                            y: parseInt(position.y, 10)
                        }
                    });
                    console.log(position);
                    console.log(_this.w);
                    console.log(_this.h);

                    console.log(_this.state);

                    line.plot(
                        _this.state.lineStartPoint.x / _this.wReal * _this.w + HANDLER_RADIUS,
                        _this.state.lineStartPoint.y / _this.hReal * _this.h + HANDLER_RADIUS,
                        _this.state.lineEndPoint.x / _this.wReal * _this.w + HANDLER_RADIUS,
                        _this.state.lineEndPoint.y / _this.hReal * _this.h + HANDLER_RADIUS
                    );

                    return { x: x < _this.w && x > 0, y: y < _this.h && y > 0 }
                });

                return handler;
            };

            makeHandler('lineStartPoint');
            makeHandler('lineEndPoint');
        }
    }

    render() {
        return (
            <div className="canvas-wrapper-outer">
                <div className="canvas-size">
                    <ReactResizeDetector handleWidth handleHeight onResize={this._onResize} />
                    <div
                        className="canvas-wrapper"
                        onMouseDown={this.setLineProfileStartPoint.bind(this)}
                        onMouseUp={this.setLineProfileEndPoint.bind(this)}
                        ref={(canvasWrapper) => { this.canvasWrapper = canvasWrapper; }}
                    >
                        <div>
                            <Modal
                                isOpen={this.state.modalIsOpen}
                                onAfterOpen={this.afterOpenModal}
                                onRequestClose={this.closeModal}
                                appElement={this.canvasWrapper}
                                style={customStyles}
                                contentLabel="Line Profile"
                            >
                                <h2 ref={subtitle => this.subtitle = subtitle}>
                                    LineProfile
                                </h2>
                                <button onClick={this.closeModal}>close</button>
                                <LineProfile
                                    data={this.state.subimage}
                                    startPoint={this.state.lineStartPoint}
                                    endPoint={this.state.lineEndPoint}
                                />
                            </Modal>
                        </div>
                    </div>
                </div>
                <div className="line-editor-wrapper-outer">
                    <div
                        className="line-editor-wrapper"
                        ref={(lineEditorWrapper) => { this.lineEditorWrapper = lineEditorWrapper; }}
                    />
                    <button onClick={this.openModal}></button>
                </div>
            </div>
        );
    }
}

export default Image;
