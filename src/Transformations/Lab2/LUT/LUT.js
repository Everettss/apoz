import React, { Component } from 'react';
import bezierEasing from 'bezier-easing';
import * as d3 from 'd3';
import 'svg.js';
import 'svg.draggable.js';
import './LUT.css';
import _ from 'lodash';
import { forEachPixel } from '../../../utils/helpers';

const DEFAULT_M = 256;
const BOX_SIZE = DEFAULT_M - 1;
const HANDLER_RADIUS = 7;
const BOX_PADDING = 27;

const lutTransformation = (LUT) => {
    return image => {
        forEachPixel(image, pixel => LUT[pixel]);

        return {
            title: 'LUT',
            picture: image
        };
    };
};

class LUT extends Component {
    constructor(props) {
        super(props);
        this.state = {
            e1: { x: 0, y: BOX_SIZE },
            e2: { x: BOX_SIZE, y: 0 },
            h1: {
                x: BOX_SIZE * 0.25 / Math.sqrt(2),
                    y: BOX_SIZE * (1 - 0.25 / Math.sqrt(2))
            },
            h2: {
                x: BOX_SIZE * (1 - 0.25 / Math.sqrt(2)),
                    y: BOX_SIZE * 0.25 / Math.sqrt(2)
            }
        };

        this.bezierHandler = this.bezierHandler.bind(this);
        this.formHandler = this.formHandler.bind(this);
    }

    componentDidMount() {
        const state = this.state;
        state.hProportions = _.cloneDeep(state);
        const handlers = {};

        const draw = window.SVG('editor').size(BOX_SIZE + HANDLER_RADIUS * 2, BOX_SIZE + HANDLER_RADIUS * 2);

        draw.rect(BOX_SIZE, BOX_SIZE).move(HANDLER_RADIUS, HANDLER_RADIUS).addClass('box')
            .attr({
                fill: 'none',
                strokeWidth: 1,
                stroke: '#333333'
            });

        const path = draw
            .path(`
                    M ${state.e1.x + HANDLER_RADIUS} ${state.e1.y + HANDLER_RADIUS} 
                    C ${state.h1.x + HANDLER_RADIUS} ${state.h1.y + HANDLER_RADIUS}, 
                    ${state.h2.x + HANDLER_RADIUS} ${state.h2.y + HANDLER_RADIUS}, 
                    ${state.e2.x + HANDLER_RADIUS} ${state.e2.y + HANDLER_RADIUS}
                `);
        path.fill('none').move(HANDLER_RADIUS, HANDLER_RADIUS);
        path.stroke({ color: 'grey', width: 4, linecap: 'round', linejoin: 'round' });


        const makeLine = (start, end) =>
            draw
                .line(
                    start.x + HANDLER_RADIUS,
                    start.y + HANDLER_RADIUS,
                    end.x + HANDLER_RADIUS,
                    end.y + HANDLER_RADIUS
                )
                .stroke({ width: 2, color: 'red' });

        const line1 = makeLine(state.e1, state.h1);
        const line2 = makeLine(state.e2, state.h2);

        const updateLine = (line, start, end) => {
            line.plot(
                start.x + HANDLER_RADIUS,
                start.y + HANDLER_RADIUS,
                end.x + HANDLER_RADIUS,
                end.y + HANDLER_RADIUS
            )
        };

        const updateLines = () => {
            updateLine(line1, state.e1, state.h1);
            updateLine(line2, state.e2, state.h2);
        };

        const updatePath = () => {
            path
                .plot(`
                    M ${HANDLER_RADIUS} ${state.e1.y + HANDLER_RADIUS}
                    L ${state.e1.x + HANDLER_RADIUS} ${state.e1.y + HANDLER_RADIUS} 
                    C ${state.h1.x + HANDLER_RADIUS} ${state.h1.y + HANDLER_RADIUS}, 
                    ${state.h2.x + HANDLER_RADIUS} ${state.h2.y + HANDLER_RADIUS}, 
                    ${state.e2.x + HANDLER_RADIUS} ${state.e2.y + HANDLER_RADIUS}
                    L ${BOX_SIZE + HANDLER_RADIUS} ${state.e2.y + HANDLER_RADIUS}
                `)
        };

        const makeHandler = (stateHandler, color, checkBound, cb = () => {}) => {
            const handler = draw
                .circle(HANDLER_RADIUS * 2)
                .move(stateHandler.x, stateHandler.y)
                .attr({ fill: color })
                .addClass('lut-handler');

            const setState = this.setState.bind(this);
            handler.draggable(function(x, y) {
                const position = {
                    x: this.cx() - HANDLER_RADIUS,
                    y: this.cy() - HANDLER_RADIUS,
                };
                stateHandler.x = position.x;
                stateHandler.y = position.y;

                cb();
                updatePath();
                updateLines();

                setState(_.cloneDeep({
                    h1: state.h1,
                    h2: state.h2,
                    e1: state.e1,
                    e2: state.e2,
                }));

                return checkBound(x, y);
            });

            return handler;
        };

        const checkBoundE1 = (x, y) => {
            return { x: x < BOX_SIZE && x > 0 && x < state.e2.x - HANDLER_RADIUS, y: y < BOX_SIZE && y > 0 };
        };

        const checkBoundE2 = (x, y) => {
            return { x: x < BOX_SIZE && x > 0 && x > state.e1.x + HANDLER_RADIUS, y: y < BOX_SIZE && y > 0 };
        };

        const checkBoundH1 = (x, y) => {
            return {
                x: x < BOX_SIZE && x > 0 && x < state.e2.x && x > state.e1.x,
                y: y < BOX_SIZE && y > 0 &&
                (state.e2.y < state.e1.y ? y > state.e2.y : y < state.e2.y) &&
                (state.e2.y < state.e1.y ? y < state.e1.y : y > state.e1.y)
            };
        };

        const checkBoundH2 = (x, y) => {
            return {
                x: x < BOX_SIZE && x > 0 && x > state.e1.x && x < state.e2.x,
                y: y < BOX_SIZE && y > 0 &&
                (state.e2.y > state.e1.y ? y < state.e2.y : y > state.e2.y) &&
                (state.e2.y > state.e1.y ? y > state.e1.y : y < state.e1.y)
            };
        };

        const onChangeH = () => {
            state.hProportions = _.cloneDeep({
                h1: state.h1,
                h2: state.h2,
                e1: state.e1,
                e2: state.e2,
            });
        };

        const onChangeE = () => {
            const hP = state.hProportions;
            const h1x = state.e1.x + (hP.h1.x - hP.e1.x) / (hP.e2.x - hP.e1.x) * (state.e2.x - state.e1.x);
            const h1y = state.e2.y + (hP.h1.y - hP.e2.y) / (hP.e1.y - hP.e2.y) * (state.e1.y - state.e2.y);
            const h2x = state.e1.x + (hP.h2.x - hP.e1.x) / (hP.e2.x - hP.e1.x) * (state.e2.x - state.e1.x);
            const h2y = state.e2.y + (hP.h2.y - hP.e2.y) / (hP.e1.y - hP.e2.y) * (state.e1.y - state.e2.y);
            state.h1.x = h1x > BOX_SIZE ? BOX_SIZE : (h1x < 0 ? 0 : h1x);
            state.h1.y = h1y > BOX_SIZE ? BOX_SIZE : (h1y < 0 ? 0 : h1y);
            state.h2.x = h2x > BOX_SIZE ? BOX_SIZE : (h2x < 0 ? 0 : h2x);
            state.h2.y = h2y > BOX_SIZE ? BOX_SIZE : (h2y < 0 ? 0 : h2y);
            handlers.h1.move(state.h1.x, state.h1.y);
            handlers.h2.move(state.h2.x, state.h2.y);
        };

        handlers.e1 = makeHandler(state.e1, 'blue', checkBoundE1, onChangeE);
        handlers.e2 = makeHandler(state.e2, 'blue', checkBoundE2, onChangeE);
        handlers.h1 = makeHandler(state.h1, 'red', checkBoundH1, onChangeH);
        handlers.h2 = makeHandler(state.h2, 'red', checkBoundH2, onChangeH);

        const width = BOX_SIZE, height = BOX_SIZE;

        const svg = d3.select("#axis").append("svg")
            .attr("width", width + BOX_PADDING * 2)
            .attr("height", height + BOX_PADDING * 2);

        const xScale = d3.scaleLinear()
            .domain([0, DEFAULT_M - 1])
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([0, DEFAULT_M - 1])
            .range([height, 0]);

        const x_axis = d3.axisBottom(xScale)
            .tickValues([0, 63, 127, 191, 255]);

        const y_axis = d3.axisLeft(yScale)
            .tickValues([0, 63, 127, 191, 255]);

        svg.append("g")
            .attr("transform", "translate(" + BOX_PADDING + ", " + BOX_PADDING  +")")
            .call(y_axis);


        svg.append("g")
            .attr("transform", "translate(" + BOX_PADDING + ", " + (BOX_SIZE + BOX_PADDING)  +")")
            .call(x_axis)

    }

    bezierHandler(curve) {
        this.setState({ curve });
    }

    formHandler(e) {
        e.preventDefault();

        let LUT = [];

        const e1x = Math.round(this.state.e1.x);
        const e2x = Math.round(this.state.e2.x);

        const height = this.state.e1.y - this.state.e2.y;
        const width = e2x - e1x + 1;
        const offset = BOX_SIZE - this.state.e1.y;

        const curve = [
            (this.state.h1.x - this.state.e1.x) / (this.state.e2.x - this.state.e1.x),
            (this.state.h1.y - this.state.e1.y) / (this.state.e2.y - this.state.e1.y),
            (this.state.h2.x - this.state.e1.x) / (this.state.e2.x - this.state.e1.x),
            (this.state.h2.y - this.state.e1.y) / (this.state.e2.y - this.state.e1.y),
        ];

        const easing = bezierEasing(...curve);



        for (let i = 0; i < e1x; i++) {
            LUT = [...LUT, Math.round(offset)];
        }

        for (let i = 0; i < width; i++) {
            let newVal = Math.round(easing(i / (width - 1)) * (height) + offset);
            LUT = [...LUT, newVal];
        }

        for (let i = e2x; i < BOX_SIZE; i++) {
            LUT = [...LUT, Math.round(BOX_SIZE - this.state.e2.y)];
        }

        this.props.updateImage(lutTransformation(LUT));
    }

    render() {
        return (
            <div>
                <h3 className="aside__item__title">LUT</h3>
                <form action="#" onSubmit={this.formHandler}>
                    <div
                        className="lut-editor__wrapper"
                        style={{
                            width: BOX_SIZE + BOX_PADDING * 2,
                            height: BOX_SIZE + BOX_PADDING * 2,
                        }}
                    >
                        <div id="axis" />
                        <div id="editor" />
                    </div>

                    <br />
                    <input type="submit" value="Apply"/>
                </form>
            </div>
        );
    }
}

export default LUT;
export { lutTransformation };
