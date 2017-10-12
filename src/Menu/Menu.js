import React, { Component } from 'react';
import './Menu.css';
import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';
import Lighten from '../Transformations/Lighten/Lighten';
import HistogramTransformation from '../Transformations/Histogram/Histogram';

class Menu extends Component {
    constructor(props) {
        super(props);
        this.dropdowns = new Map();
        this.hideDropdowns = this.hideDropdowns.bind(this);
        this.handleMenuClick = this.handleMenuClick.bind(this);
    }

    hideDropdowns() {
        this.dropdowns.forEach(dropdown => {
            dropdown.hide();
        })
    }

    handleMenuClick(component) {
        return e => {
            e.preventDefault();
            this.hideDropdowns();
            this.props.handleMenu(component)
        }
    }

    render() {
        return (
            <div className="menu__inner-wrapper">
                <a
                    href="#"
                    onClick={this.handleMenuClick(<HistogramTransformation updateImage={this.props.updateImage} />)}
                >
                    histogram
                </a>
                <a
                    href="#"
                    onClick={this.handleMenuClick(<Lighten updateImage={this.props.updateImage} />)}
                >
                    lighten
                </a>

                <Dropdown ref={dropdown => { dropdown && this.dropdowns.set(1, dropdown); }}>
                    <DropdownTrigger>lab2</DropdownTrigger>
                    <DropdownContent>
                        <a
                            href="#"
                            onClick={
                                this.handleMenuClick(<HistogramTransformation updateImage={this.props.updateImage} />)
                            }
                        >
                            histogram
                        </a>
                        <a
                            href="#"
                            onClick={
                                this.handleMenuClick(<Lighten updateImage={this.props.updateImage} />)
                            }
                        >
                            lighten
                        </a>
                    </DropdownContent>
                </Dropdown>

                <Dropdown ref={dropdown => { dropdown && this.dropdowns.set(2, dropdown); }}>
                    <DropdownTrigger>lab3</DropdownTrigger>
                    <DropdownContent>
                        <a
                            href="#"
                            onClick={
                                this.handleMenuClick(<div>todo 1 operation</div>)
                            }
                        >
                            todo 1
                        </a>
                        <a
                            href="#"
                            onClick={
                                this.handleMenuClick(<div>todo 2 operation</div>)
                            }
                        >
                            todo 2
                        </a>
                    </DropdownContent>
                </Dropdown>
            </div>
        );
    }
}

export default Menu;
