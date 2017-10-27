import React, { Component } from 'react';
import './Menu.css';
import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';
import ImportImage from '../ImportImage/ImportImage';
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
import Edges from '../Transformations/Lab3/Edges/Edges';
import UniversalLogicalSmooth from '../Transformations/Lab3/UniversalLogicalSmooth/UniversalLogicalSmooth';

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
                <Dropdown ref={dropdown => { dropdown && this.dropdowns.set(1, dropdown); }}>
                    <DropdownTrigger>add image</DropdownTrigger>
                    <DropdownContent className="dropdown__content--image">
                        <div className="aside__item aside__item--upload">
                            <h3 className="aside__item__title">Upload image</h3>
                            <ImportImage
                                importImageOnBoostrap={true}
                                importHandler={this.props.importFirstImageHandler}
                            />
                        </div>
                    </DropdownContent>
                </Dropdown>
                <a
                    onClick={this.handleMenuClick(<Greyscale updateImage={this.props.updateImage} />)}
                >
                    greyscale
                </a>
                <a
                    onClick={this.handleMenuClick(<HistogramTransformation updateImage={this.props.updateImage} />)}
                >
                    histogram
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
                                this.handleMenuClick(<UniversalLogicalSmooth updateImage={this.props.updateImage} />)
                            }
                        >
                            universal logical smooth
                        </a>
                        <a
                            onClick={
                                this.handleMenuClick(<Edges updateImage={this.props.updateImage} />)
                            }
                        >
                            edges
                        </a>
                    </DropdownContent>
                </Dropdown>
            </div>
        );
    }
}

export default Menu;
