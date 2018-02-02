import React, { Component } from 'react';
import './Image.css'
import Modal from 'react-modal';
import savePixels from 'save-pixels';
import 'svg.js';
import 'svg.draggable.js';
import ReactResizeDetector from 'react-resize-detector';
import LineProfile from "../LineProfile/LineProfile";


const HANDLER_RADIUS = 8;

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
            subimage: null,
        };

        this.draw = null;
        this.w = 0;
        this.h = 0;

        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this._onResize = this._onResize.bind(this);
    }


    openModal() {
        this.setState({ modalIsOpen: true });
    }

    afterOpenModal() {
        // references are now sync'd and can be accessed.
        this.subtitle.style.color = '#f00';
    }

    closeModal() {
        this.setState({modalIsOpen: false});
    }

    _onResize() {
        this.w = this.canvas ? this.canvas.offsetWidth : 0;
        this.h = this.canvas ? this.canvas.offsetHeight : 0;
        this.wReal = this.canvas ? parseFloat(this.canvas.getAttribute('width')) : 0;
        this.hReal = this.canvas ? parseFloat(this.canvas.getAttribute('height')) : 0;
        if (this.draw) {
            this.draw.size(this.w + HANDLER_RADIUS * 2, this.h + HANDLER_RADIUS * 2)
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
            if (this.canvas) {
                this.draw.clear();
                this.lineEditorWrapper.innerHTML = '';
            }

            const canvas = savePixels(nextProps.data.picture, 'canvas');
            this.canvas = canvas;
            this.canvasWrapper.innerHTML = '';
            this.canvasWrapper.appendChild(canvas);
            this.setState({subimage: nextProps.data.picture});

            const _this = this;

            this.w = this.canvas ? this.canvas.offsetWidth : 0;
            this.h = this.canvas ? this.canvas.offsetHeight : 0;
            this.wReal = this.canvas ? parseFloat(this.canvas.getAttribute('width')) : 0;
            this.hReal = this.canvas ? parseFloat(this.canvas.getAttribute('height')) : 0;

            this.setState({
                lineStartPoint: {
                    x: 0.25 * _this.wReal,
                    y: 0.25 * _this.hReal
                },
                lineEndPoint: {
                    x: 0.75 * _this.wReal,
                    y: 0.75 * _this.hReal
                },
            }, () => {
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
                        .addClass('line-handler');

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
            });
        }
    }

    render() {
        return (
            <div className="canvas-wrapper-outer">
                <div className="canvas-size">
                    <ReactResizeDetector handleWidth handleHeight onResize={this._onResize} />
                    <div
                        className="canvas-wrapper"
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
                    <div>
                        <button className="line-profile-apply" onClick={this.openModal}>apply</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Image;
