import React, { Component } from 'react';
import './Menu.css';
import Lighten from '../Transformations/Lighten/Lighten';
import HistogramTransformation from '../Transformations/Histogram/Histogram';

class Menu extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="menu__inner-wrapper">
                <a
                    href="#"
                    onClick={this.props.handleMenu(<HistogramTransformation updateImage={this.props.updateImage} />)}
                >
                    histogram
                </a>
                <a
                    href="#"
                    onClick={this.props.handleMenu(<Lighten updateImage={this.props.updateImage} />)}
                >
                    lighten
                </a>
            </div>
        );
    }
}

export default Menu;
