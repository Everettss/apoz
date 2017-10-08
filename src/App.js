import React, { Component } from 'react';
import './App.css';
import 'font-awesome/css/font-awesome.css';
import getPixels from 'get-pixels';
import lenna from './Lenna.png';
import Histogram from './Histogram/Histogram';
import Image from './Image/Image';

import Lighten from './Lighten/Lighten';


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            transformations: [],
            originalPicture: null,
        };
        this.fileChange = this.fileChange.bind(this);
        this.updateImage = this.updateImage.bind(this);
        this.handleRemoveHistory = this.handleRemoveHistory.bind(this);
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
                originalPicture: picture,
                transformations: [
                    {
                        title: 'load image',
                        picture,
                        fn: x => x
                    }
                ]
            });
        })
    }

    updateImage(fn) {
        const transformation = fn(this.state.transformations[this.state.transformations.length - 1].picture);

        this.setState({
            transformations: [
                ...this.state.transformations,
                Object.assign({}, transformation, { fn })
            ]
        });
    }

    handleRemoveHistory(position) {
        return () => {
            console.log(position);
            const prevPicture = this.state.transformations[position - 1].picture;
            const nextTransformations = this.state.transformations
                .map(x => ({ title: x.title, fn: x.fn }))
                .filter((_, i) => i > position);

            const newTransformations = this.state.transformations.filter((_, i) => i < position);

            nextTransformations.forEach(transformation => {
                const res = transformation.fn(newTransformations[newTransformations.length - 1].picture);
                newTransformations.push(Object.assign({}, res, { fn: transformation.fn }));
            });
            console.log(prevPicture);
            console.log(nextTransformations);
            console.log(newTransformations);

            this.setState({ transformations: newTransformations });
        }
    }

    render() {
        console.log(this.state);
        return (
            <div className="App">
                <div className="menu">menu</div>
                <div className="app-shell">
                    <div className="images">
                        <div className="images-row image-modified">
                            <div className="histogram-wrapper">
                                <Histogram
                                    data={
                                        this.state.transformations.length &&
                                        this.state.transformations[this.state.transformations.length - 1].picture
                                    }
                                />
                            </div>
                            <div className="image-wrapper">
                                <Image
                                    data={
                                        this.state.transformations.length &&
                                        this.state.transformations[this.state.transformations.length - 1].picture
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
                        <h3>Operation</h3>
                        <Lighten updateImage={this.updateImage} />

                        <h3>History</h3>

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


                <p className="App-intro">
                    <input type='file' name='img' size='65' id='uploadimage' onChange={this.fileChange}/>
                </p>
            </div>
        );
    }
}

export default App;
