import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import * as d3 from 'd3';
import './Histogram.css';
// import getPixels from 'get-pixels';

const lineChart = (_data, el) => {
    const data = [{ x: -1, r: 0, g: 0, b: 0, bw: 0 }, ..._data, { x: 256, r: 0, g: 0, b: 0, bw: 0 }];
    const svg = d3.select(el);
    const margin = {top: 20, right: 15, bottom: 30, left: 15};
    const width = +svg.attr('width') - margin.left - margin.right;
    const height = +svg.attr('height') - margin.top - margin.bottom;
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

    // Add the X Axis
    graph.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickValues([0, 63, 127, 191, 255]).tickSizeOuter(0));

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

        histBWValue.select("text").text("bw: " + roundTo2(data[x0].bw, maxBW));
        histBValue.select("text").text("b:  " + roundTo2(data[x0].b, maxB));
        histRValue.select("text").text("r:  " + roundTo2(data[x0].r, maxR));
        histGValue.select("text").text("g:  " + roundTo2(data[x0].g, maxG));
        histXValue.select("text").text("x:  " + x0);

    });

    svg.on("mouseout", function () {
        histBWValue.select("text").text("");
        histBValue.select("text").text("");
        histRValue.select("text").text("");
        histGValue.select("text").text("");
        histXValue.select("text").text("");
    });

    function roundTo2 (a, b) {
        return +(Math.round( (a * 100) / b)  / 100);
    }
};


const getHistogramData = picture => {
    console.log (picture);
    const width = picture.shape[0];
    const height = picture.shape[1];

    let hist = new Array(256).fill({});

    hist = hist.map((_, i) => ({ x: i, r: 0, g: 0, b: 0, bw: 0 }));

    for (let i = 0; i < width; ++i) {
        for (let j = 0; j < height; ++j) {
            const r = picture.get(i, j, 0);
            const g = picture.get(i, j, 1);
            const b = picture.get(i, j, 2);
            const bw = Math.round((r + g + b) / 3);
            Object.assign(hist[r], { r: hist[r].r + 1 });
            Object.assign(hist[g], { g: hist[g].g + 1 });
            Object.assign(hist[b], { b: hist[b].b + 1 });
            Object.assign(hist[bw], { bw: hist[bw].bw + 1 });
        }
    }

    return hist;
};


class Histogram extends Component {
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
            lineChart(getHistogramData(nextProps.data.picture), findDOMNode(this));
        }
    }

    render() {
        return (
            <svg width="442" height="300" />
        );
    }
}

export default Histogram;
