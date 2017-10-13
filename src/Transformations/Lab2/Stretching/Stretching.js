import React, { Component } from 'react';
import { forEachPixel } from '../../../utils/helpers';

const stretchingTransformation = (p1, p2, q3, q4, qBackground, M = 256) => image => {
    forEachPixel(image, pixel => {
        return pixel; // TODO implement Stretching
    });

    return {
        title: `stretching p1:${p1}, p2:${p2}, q3:${q3}, q4:${q4}, background:${qBackground}`,
        picture: image
    };
};

class Stretching extends Component {
    constructor(props) {
        super(props);
        this.state = { p1: 0, p2: 255, q3: 0, q4: 255, qBackground: 0 };

        this.inputHandlerP1 = this.inputHandlerP1.bind(this);
        this.inputHandlerP2 = this.inputHandlerP2.bind(this);
        this.inputHandlerQ3 = this.inputHandlerQ3.bind(this);
        this.inputHandlerQ4 = this.inputHandlerQ4.bind(this);
        this.inputHandlerQBackground = this.inputHandlerQBackground.bind(this);
        this.formHandler = this.formHandler.bind(this);
    }

    inputHandlerP1(e) {
        const level = parseInt(e.target.value, 10);
        if (level < this.state.p2) {
            this.setState({ p1: level });
        }
    }
    inputHandlerP2(e) {
        const level = parseInt(e.target.value, 10);
        if (this.state.p1 < level) {
            this.setState({ p2: level });
        }
    }

    inputHandlerQ3(e) {
        const level = parseInt(e.target.value, 10);
        if (level < this.state.q4) {
            this.setState({ q3: level });
        }
    }

    inputHandlerQ4(e) {
        const level = parseInt(e.target.value, 10);
        if (this.state.q3 < level) {
            this.setState({ q4: level });
        }
    }

    inputHandlerQBackground(e) {
        const level = parseInt(e.target.value, 10);
        this.setState({ qBackground: level });
    }

    formHandler(e) {
        e.preventDefault();
        this.props.updateImage(
            stretchingTransformation(
                this.state.p1,
                this.state.p2,
                this.state.q3,
                this.state.q4,
                this.state.qBackground
            )
        );
    }

    render() {
        return (
            <div>
                <h3 className="aside__item__title">Stretching</h3>
                <form action="#" onSubmit={this.formHandler}>
                    <input
                        type="range"
                        step="1"
                        min="0"
                        max="255"
                        value={this.state.p1}
                        onChange={this.inputHandlerP1}
                    />
                    p1: {this.state.p1}<br/>
                    <input
                        type="range"
                        step="1"
                        min="0"
                        max="255"
                        value={this.state.p2}
                        onChange={this.inputHandlerP2}
                    />
                    p2: {this.state.p2}<br/>
                    <input
                        type="range"
                        step="1"
                        min="0"
                        max="255"
                        value={this.state.q3}
                        onChange={this.inputHandlerQ3}
                    />
                    q3: {this.state.q3}<br/>
                    <input
                        type="range"
                        step="1"
                        min="0"
                        max="255"
                        value={this.state.q4}
                        onChange={this.inputHandlerQ4}
                    />
                    q4: {this.state.q4}<br/>
                    <input
                        type="range"
                        step="1"
                        min="0"
                        max="255"
                        value={this.state.qBackground}
                        onChange={this.inputHandlerQBackground}
                    />
                    q_background: {this.state.qBackground}<br/>
                    <input type="submit" value="Apply"/>
                </form>
            </div>
        );
    }
}

export default Stretching;
export { stretchingTransformation };
