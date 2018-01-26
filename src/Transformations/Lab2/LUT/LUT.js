import React, { Component } from 'react';
import BezierEditor from 'bezier-easing-editor';
import bezierEasing from 'bezier-easing';
import * as d3 from 'd3';
import 'svg.js';
import 'svg.draggable.js';
import './LUT.css';
import _ from 'lodash';
import { forEachPixel } from '../../../utils/helpers';

const DEFAULT_M = 256;
const BOX_SIZE = DEFAULT_M - 1;
const DEFAULT_CURVE = [0.2, 0.2, 0.8, 0.8];

const lutTransformation = (LUT, M = DEFAULT_M) => {
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
        const HANDLER_RADIUS = 10;
        const BOX_PADDING = 30;









        const state = this.state;
        state.hProportions = _.cloneDeep(state);
        const handlers = {};

        const draw = window.SVG('test').size(BOX_SIZE + HANDLER_RADIUS * 2, BOX_SIZE + HANDLER_RADIUS * 2);

        draw.rect(BOX_SIZE, BOX_SIZE).move(HANDLER_RADIUS, HANDLER_RADIUS).addClass('box')
            .attr({
                fill: 'none',
                strokeWidth: 1,
                stroke: 'green'
            });

        const path = draw
            .path(`
                    M ${state.e1.x + HANDLER_RADIUS} ${state.e1.y + HANDLER_RADIUS} 
                    C ${state.h1.x + HANDLER_RADIUS} ${state.h1.y + HANDLER_RADIUS}, 
                    ${state.h2.x + HANDLER_RADIUS} ${state.h2.y + HANDLER_RADIUS}, 
                    ${state.e2.x + HANDLER_RADIUS} ${state.e2.y + HANDLER_RADIUS}
                `);
        path.fill('none').move(HANDLER_RADIUS, HANDLER_RADIUS)
        path.stroke({ color: 'blue', width: 4, linecap: 'round', linejoin: 'round' });


        const makeLine = (start, end) =>
            draw
                .line(
                    start.x + HANDLER_RADIUS,
                    start.y + HANDLER_RADIUS,
                    end.x + HANDLER_RADIUS,
                    end.y + HANDLER_RADIUS
                )
                .stroke({ width: 1 });

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

        const makeHandler = (stateHandler, checkBound, cb = () => {}) => {
            const handler = draw.circle(HANDLER_RADIUS * 2).move(stateHandler.x, stateHandler.y).attr({ fill: '#f06' });

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
                console.log(state);

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

        handlers.e1 = makeHandler(state.e1, checkBoundE1, onChangeE);
        handlers.e2 = makeHandler(state.e2, checkBoundE2, onChangeE);
        handlers.h1 = makeHandler(state.h1, checkBoundH1, onChangeH);
        handlers.h2 = makeHandler(state.h2, checkBoundH2, onChangeH);











        var width = BOX_SIZE, height = BOX_SIZE;

        var data = [10, 15, 20, 25, 30];
        var svg = d3.select("#test > svg");

        var xscale = d3.scaleLinear()
            .domain([0, d3.max(data)])
            .range([0, width]);

        var yscale = d3.scaleLinear()
            .domain([0, d3.max(data)])
            .range([height/2, 0]);

        var x_axis = d3.axisBottom()
            .scale(xscale);

        var y_axis = d3.axisLeft()
            .scale(yscale);

        svg.append("g")
            .attr("transform", "translate(50, 10)")
            .call(y_axis);

        var xAxisTranslate = BOX_SIZE + HANDLER_RADIUS;

        svg.append("g")
            .attr("transform", "translate(50, " + xAxisTranslate  +")")
            .call(x_axis)

    }

    bezierHandler(curve) {
        this.setState({ curve });
    }

    formHandler(e) {
        e.preventDefault();

        console.log(this.state);
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
        ]
        console.log(
            e1x, e2x, height, offset
        );

        console.log(curve);

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


        console.log(LUT);
        this.props.updateImage(lutTransformation(LUT));
    }

    render() {
        return (
            <div>
                <h3 className="aside__item__title">Reduction of gray levels</h3>
                <form action="#" onSubmit={this.formHandler}>
                    <div id="axis" />
                    <div id="test" />
                    {/*<BezierEditor className="bezier" defaultValue={DEFAULT_CURVE} onChange={this.bezierHandler} />*/}
                    <br />
                    <input type="submit" value="Apply"/>
                </form>
            </div>
        );
    }
}

export default LUT;
export { lutTransformation };
