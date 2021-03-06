import React, { Component } from 'react';
import './App.css';
import 'font-awesome/css/font-awesome.css';
import Histogram from './Histogram/Histogram';
import Image from './Image/Image';
import Menu from './Menu/Menu';
import { cloneImage } from './utils/helpers';


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            transformations: [],
            originalPicture: null,
            secondPicture: null,
            operation: null,
            lineProfile: {
                first: false,
                second: false,
            },
        };
        this.handleRemoveHistory = this.handleRemoveHistory.bind(this);
        this.handleMenu = this.handleMenu.bind(this);
        this.importImageHandler = this.importImageHandler.bind(this);
        this.updateImage = this.updateImage.bind(this);
        this.importSecondImageHandler = this.importSecondImageHandler.bind(this);
    }

    importImageHandler(picture) {
        this.setState({
            secondPicture: null,
            operation: null,
            lineProfile: {
                first: false,
                second: false,
            },
            originalPicture: {
                picture,
                modificationDate: new Date(),
            },
            transformations: [
                {
                    title: 'load image',
                    picture,
                    fn: x => x,
                    modificationDate: new Date(),
                }
            ]
        });
    }

    importSecondImageHandler(picture, cb) {
        const shapeFirst = this.state.transformations[this.state.transformations.length - 1].picture.shape;
        const shapeSecond = picture.shape;

        if (shapeFirst[0] === shapeSecond[0] && shapeFirst[1] === shapeSecond[1]) {
            const secondPicture = {
                picture,
                modificationDate: new Date(),
            };
            this.setState({ secondPicture }, cb(false, secondPicture));
        } else {
            cb('Not the same size!');
        }
    }

    updateImage(fn) {
        const image = this.state.transformations[this.state.transformations.length - 1].picture;
        const newImage = cloneImage(image);
        const secondImage = this.state.secondPicture && this.state.secondPicture.picture;
        const transformation = fn(newImage, secondImage);

        this.setState({
            transformations: [
                ...this.state.transformations,
                Object.assign({}, transformation, { fn, modificationDate: new Date() })
            ]
        });
    }

    handleRemoveHistory(position) {
        return () => {
            const nextTransformations = this.state.transformations
                .map(x => ({ title: x.title, fn: x.fn }))
                .filter((_, i) => i > position);

            const newTransformations = this.state.transformations.filter((_, i) => i < position);

            nextTransformations.forEach(transformation => {
                const image = newTransformations[newTransformations.length - 1].picture;
                const newImage = cloneImage(image);
                const secondImage = this.state.secondPicture && this.state.secondPicture.picture;
                const res = transformation.fn(newImage, secondImage);
                newTransformations.push(Object.assign(
                    {},
                    res,
                    { fn: transformation.fn, modificationDate: new Date() }
                ));
            });

            this.setState({ transformations: newTransformations });
        }
    }

    handleMenu(operation) {
        this.setState({ operation });
    }

    render() {
        return (
            <div className="App">
                <div className="menu">
                    <Menu
                        handleMenu={this.handleMenu}
                        updateImage={this.updateImage}
                        importFirstImageHandler={this.importImageHandler}
                        importSecondImageHandler={this.importSecondImageHandler}
                        secondImage={this.state.secondPicture}
                    />
                </div>
                <div className="app-shell">
                    <div className="images">
                        <div
                            className={`images-row image-modified ${
                                this.state.lineProfile.first ? 'display-line-profile' : ''
                            }`}
                        >
                            <div className="histogram-wrapper">
                                <Histogram
                                    data={
                                        this.state.transformations.length &&
                                        this.state.transformations[this.state.transformations.length - 1]
                                    }
                                />
                                <div>
                                    <button
                                        onClick={() => this.setState(prevState => ({
                                            lineProfile: Object.assign(
                                                {},
                                                this.state.lineProfile,
                                                { first: !prevState.lineProfile.first })
                                        }))}
                                    >
                                        line profile
                                    </button>
                                </div>
                            </div>
                            <div className="image-wrapper">
                                <Image
                                    data={
                                        this.state.transformations.length &&
                                        this.state.transformations[this.state.transformations.length - 1]
                                    }
                                />
                            </div>
                        </div>
                        <div className={`images-row image-image-original ${
                                this.state.lineProfile.second ? 'display-line-profile' : ''
                            }`}
                        >
                            <div className="histogram-wrapper">
                                <Histogram data={this.state.originalPicture} />
                                <div>
                                    <button
                                        onClick={() => this.setState(prevState => ({
                                            lineProfile: Object.assign(
                                                {},
                                                this.state.lineProfile,
                                                { second: !prevState.lineProfile.second })
                                        }))}
                                    >
                                        line profile
                                    </button>
                                </div>
                            </div>
                            <div className="image-wrapper">
                                <Image data={this.state.originalPicture}/>
                            </div>
                        </div>
                    </div>
                    <div className="aside">
                        {this.state.operation ? <div className="aside__item aside__item--operation">
                            {this.state.operation}
                        </div> : ''}
                        <div className="aside__item aside__item--history">
                            <h3 className="aside__item__title">History</h3>

                            {this.state.transformations.map((transformation, i) => {
                                return <div className="history-position" key={i}>
                                    <div className="history-position__title">
                                        {transformation.title}
                                    </div>
                                    {i > 0 ?
                                        <i
                                            className="fa fa-trash history-position__delete"
                                            onClick={this.handleRemoveHistory(i)}
                                        /> :
                                        ''
                                    }
                                </div>
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
