import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import * as d3 from 'd3';
import './LineProfile.css';

const lineChart = (_data, startPoint, endPoint, el) => {
    const lineWidth = d3.max(_data, d => d.x) + 1;
    const svg = d3.select(el);
    const margin = {top: 20, right: 15, bottom: 30, left: 15};
    const width = +svg.attr('width') - margin.left - margin.right;
    const height = +svg.attr('height') - margin.top - margin.bottom;
    const data = [{ x: -1, r: 0, g: 0, b: 0, bw: 0 }, ..._data, { x: lineWidth, r: 0, g: 0, b: 0, bw: 0 }];
    const maxR = d3.max(data, d => d.r);
    const maxG = d3.max(data, d => d.g);
    const maxB = d3.max(data, d => d.b);
    const maxBW = d3.max(data, d => d.bw);

    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    svg.selectAll("*").remove();
    const graph = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Scale the range of the data
    x.domain(d3.extent(data, d => d.x));
    y.domain([0, d3.max([
        maxR,
        maxG,
        maxB,
        maxBW,
    ])]);
    const createPath = (getData, stroke, fill) => {
        const line = d3.line()
            .curve(d3.curveStep)
            .x(d => x(d.x))
            .y(d => y(getData(d)));

        graph.append('path')
            .data([data])
            .attr('class', 'line')
            .attr('fill', fill)
            .attr('stroke', stroke)
            .attr('stroke-width', '1px')
            .attr('d', line);
    };

    createPath(d => d.bw, 'gray', 'gray');
    createPath(d => d.r, 'red', 'none');
    createPath(d => d.g, 'green', 'none');
    createPath(d => d.b, 'blue', 'none');

    let stepX = Math.round (lineWidth / 4);
    let stepY = Math.round(Math.max(maxBW, maxG, maxG, maxR) / 4);

    // Add the X and Y Axis
    graph.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickValues([0, stepX, stepX * 2, stepX * 3, lineWidth]).tickSizeOuter(0));

    graph.append("g")
        .attr("transform", "translate(" + width + ", 0)")
        .call(d3.axisRight(y).tickValues([0, stepY, stepY * 2, stepY * 3, stepY * 4]).tickSizeOuter(0));

    // add value of histogram in place pointed by mouse
    let histBWValue = svg.append("g")
        .style("display", null);

    histBWValue.append("text")
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("class", "histogram-value")
        .attr("stroke", "gray")
        .attr("transform", "translate(" + 0 + "," + 5 + ")");

    let histRValue = svg.append("g")
        .style("display", null);

    histRValue.append("text")
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("class", "histogram-value")
        .attr("stroke", "red")
        .attr("transform", "translate(" + 0 + "," + 20 + ")");

    let histGValue = svg.append("g")
        .style("display", null);

    histGValue.append("text")
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("class", "histogram-value")
        .attr("stroke", "green")
        .attr("transform", "translate(" + 0 + "," + 35 + ")");

    let histBValue = svg.append("g")
        .style("display", null);

    histBValue.append("text")
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("class", "histogram-value")
        .attr("stroke", "blue")
        .attr("transform", "translate(" + 0 + "," + 50 + ")");

    let histXValue = svg.append("g")
        .style("display", null);

    histXValue.append("text")
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("class", "histogram-value")
        .attr("stroke", "black")
        .attr("transform", "translate(" + 0 + "," + 65 + ")");

    svg.on("mousemove", function () {
        var mouseX = d3.mouse(this)[0] - margin.left;
        if (mouseX < 1) {
            mouseX = 1;
        } else if (mouseX > width) {
            mouseX = width
        }
        let x0 = Math.round( x.invert(mouseX) );
        if (x0 < 0) {
            x0 = 0;
        } else if (x0 > lineWidth) {
            x0 = lineWidth;
        }

        histBWValue.select("text").text("bw: " + data[x0].bw);
        histBValue.select("text").text("b:  " +  data[x0].b);
        histRValue.select("text").text("r:  " +  data[x0].r);
        histGValue.select("text").text("g:  " +  data[x0].g);
        histXValue.select("text").text("x:  " +  x0);

    });

    svg.on("mouseout", function () {
        histBWValue.select("text").text("");
        histBValue.select("text").text("");
        histRValue.select("text").text("");
        histGValue.select("text").text("");
        histXValue.select("text").text("");
    });

};


const getHistogramData = (picture, startPoint, endPoint) => {
    let a = Math.abs(startPoint.x - endPoint.x),
        b = Math.abs(startPoint.y - endPoint.y),
        c = Math.sqrt(a * a + b * b);

    let lineLength = Math.round(c);
    const stepX = (endPoint.x - startPoint.x) / lineLength;
    const stepY = (endPoint.y - startPoint.y) / lineLength;

    let hist = new Array(lineLength).fill({});

    hist = hist.map((_, i) => ({ x: i, r: 0, g: 0, b: 0, bw: 0 }));

    for (let i = 0; i < lineLength; ++i) {
        const currX = Math.round(startPoint.x + stepX * i);
        const currY = Math.round(startPoint.y + stepY * i);
        const rc = picture.get(currX, currY, 0);
        const gc = picture.get(currX, currY, 1);
        const bc = picture.get(currX, currY, 2);
        const bwc = Math.round((rc + gc + bc) / 3);
        Object.assign(hist[i], { r: rc, g: gc, b: bc, bw:bwc });
    }

    return hist;
};


class LineProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            lineStartPoint: props.startPoint,
            lineEndPoint: props.endPoint,
            subimage: props.data,
        };

    }
    componentWillReceiveProps(nextProps) {
        if (
            !this.props.data ||
            (
                nextProps &&
                nextProps.data &&
                nextProps.startPoint &&
                this.props.data
            )
        ) {
            lineChart(
                getHistogramData(nextProps.data,
                this.state.lineStartPoint,
                this.state.lineEndPoint),
                this.state.lineStartPoint,
                this.state.lineEndPoint,
                findDOMNode(this)
            );
        }
    }

    // here we already have DOMElement set up
    componentDidMount () {
        lineChart(
            getHistogramData(this.state.subimage,
                this.state.lineStartPoint,
                this.state.lineEndPoint),
            this.state.lineStartPoint,
            this.state.lineEndPoint,
            findDOMNode(this)
        );
    }

    render() {
        return (
            <svg width="442" height="300" />
        );
    }
}

export default LineProfile;
