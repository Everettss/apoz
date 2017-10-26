import React, { Component } from 'react';
import './Menu.css';
import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';
import Lighten from '../Transformations/Lighten/Lighten';
import Greyscale from '../Transformations/Greyscale/Greyscale';
import HistogramTransformation from '../Transformations/Histogram/Histogram';
import Negation from '../Transformations/Lab2/Negation/Negation';
import LUT from '../Transformations/Lab2/LUT/LUT';
import Threshold from '../Transformations/Lab2/Threshold/Threshold';
import ThresholdGrayLevels from '../Transformations/Lab2/ThresholdGrayLevels/ThresholdGrayLevels';
import ReductionOfGrayLevels from '../Transformations/Lab2/ReductionOfGrayLevels/ReductionOfGrayLevels';
import Stretching from '../Transformations/Lab2/Stretching/Stretching';
import Arithmetic from '../Transformations/Lab2/Arithmetic/Arithmetic';
import Logical from '../Transformations/Lab2/Logical/Logical';
import Median from '../Transformations/Lab3/Median/Median';
import Filter from '../Transformations/Lab3/Filter/Filter';
import Sharpening from '../Transformations/Lab3/Sharpening/Sharpening';

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
                    onClick={this.handleMenuClick(<HistogramTransformation updateImage={this.props.updateImage} />)}
                >
                    histogram
                </a>
                <a
                    onClick={this.handleMenuClick(<Lighten updateImage={this.props.updateImage} />)}
                >
                    lighten
                </a>
                <a
                    onClick={this.handleMenuClick(<Greyscale updateImage={this.props.updateImage} />)}
                >
                    greyscale
                </a>

                <Dropdown ref={dropdown => { dropdown && this.dropdowns.set(1, dropdown); }}>
                    <DropdownTrigger>lab2</DropdownTrigger>
                    <DropdownContent>
                        <a
                            onClick={
                                this.handleMenuClick(<Negation updateImage={this.props.updateImage} />)
                            }
                        >
                            negation
                        </a>
                        <a
                            onClick={
                                this.handleMenuClick(<LUT updateImage={this.props.updateImage} />)
                            }
                        >
                            LUT
                        </a>
                        <a
                            onClick={
                                this.handleMenuClick(<Threshold updateImage={this.props.updateImage} />)
                            }
                        >
                            threshold
                        </a>
                        <a
                            onClick={
                                this.handleMenuClick(<ThresholdGrayLevels updateImage={this.props.updateImage} />)
                            }
                        >
                            threshold with gray levels
                        </a>
                        <a
                            onClick={
                                this.handleMenuClick(<ReductionOfGrayLevels updateImage={this.props.updateImage} />)
                            }
                        >
                            reduction of gray levels
                        </a>
                        <a
                            onClick={
                                this.handleMenuClick(<Stretching updateImage={this.props.updateImage} />)
                            }
                        >
                            stretching
                        </a>
                        <a
                            onClick={
                                this.handleMenuClick(
                                    <Arithmetic
                                        updateImage={this.props.updateImage}
                                        importSecondImage={this.props.importSecondImageHandler}
                                        secondImage={this.props.secondImage}
                                    />
                                )
                            }
                        >
                            arithmetic
                        </a>
                        <a
                            onClick={
                                this.handleMenuClick(
                                    <Logical
                                        updateImage={this.props.updateImage}
                                        importSecondImage={this.props.importSecondImageHandler}
                                        secondImage={this.props.secondImage}
                                    />
                                )
                            }
                        >
                            logical
                        </a>
                    </DropdownContent>
                </Dropdown>

                <Dropdown ref={dropdown => { dropdown && this.dropdowns.set(2, dropdown); }}>
                    <DropdownTrigger>lab3</DropdownTrigger>
                    <DropdownContent>
                        <a
                            onClick={
                                this.handleMenuClick(<Filter updateImage={this.props.updateImage} />)
                            }
                        >
                            filter
                        </a>
                        <a
                            onClick={
                                this.handleMenuClick(<Median updateImage={this.props.updateImage} />)
                            }
                        >
                            median
                        </a>
                        <a
                            onClick={
                                this.handleMenuClick(<Sharpening updateImage={this.props.updateImage} />)
                            }
                        >
                            sharpening
                        </a>
                    </DropdownContent>
                </Dropdown>
            </div>
        );
    }
}

export default Menu;
