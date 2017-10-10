import React, { Component } from 'react';
import './App.css';
import 'font-awesome/css/font-awesome.css';
import getPixels from 'get-pixels';
import lenna from './Lenna.png';
import Histogram from './Histogram/Histogram';
import Image from './Image/Image';
import ndarray from 'ndarray';
import Menu from './Menu/Menu';


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            transformations: [],
            originalPicture: null,
            operation: null,
        };
        this.fileChange = this.fileChange.bind(this);
        this.updateImage = this.updateImage.bind(this);
        this.handleRemoveHistory = this.handleRemoveHistory.bind(this);
        this.handleMenu = this.handleMenu.bind(this);
    }

    fileChange(e) {
        const file = e.target.files[0];
        const url = window.URL || window.webkitURL;
        const src = url.createObjectURL(file);

        this.importImage(src);
    }

    componentDidMount() {
        this.importImage(lenna);
    }

    importImage(src) {
        getPixels(src, (err, picture) => {
            if(err) {
                console.log("Bad image path");
                return
            }
            this.setState({
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
        })
    }

    updateImage(fn) {
        const image = this.state.transformations[this.state.transformations.length - 1].picture;
        const newImage = ndarray([...image.data], [...image.shape], [...image.stride]);
        const transformation = fn(newImage);

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
                const newImage = ndarray([...image.data], [...image.shape], [...image.stride]);
                const res = transformation.fn(newImage);
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
        return e => {
            e.preventDefault();
            this.setState({ operation });
        }
    }

    render() {
        return (
            <div className="App">
                <div className="menu">
                    <Menu handleMenu={this.handleMenu} updateImage={this.updateImage} />
                </div>
                <div className="app-shell">
                    <div className="images">
                        <div className="images-row image-modified">
                            <div className="histogram-wrapper">
                                <Histogram
                                    data={
                                        this.state.transformations.length &&
                                        this.state.transformations[this.state.transformations.length - 1]
                                    }
                                />
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
                        <div className="images-row image-original">
                            <div className="histogram-wrapper">
                                <Histogram data={this.state.originalPicture} />
                            </div>
                            <div className="image-wrapper">
                                <Image data={this.state.originalPicture}/>
                            </div>
                        </div>
                    </div>
                    <div className="aside">
                        {this.state.operation ? <div className="aside__item aside__item--operation">
                            <h3 className="aside__item__title">Operation</h3>
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
                        <div className="aside__item aside__item--upload">
                            <h3 className="aside__item__title">Upload image</h3>
                            <input type='file' name='img' size='65' id='uploadimage' onChange={this.fileChange}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
