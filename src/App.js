import React, { Component } from 'react';
import './App.css';
import getPixels from 'get-pixels';
import lenna from './martyna.jpeg';
import Histogram from './Histogram/Histogram';
import Image from './Image/Image';

import Lighten from './Lighten/Lighten';


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            picture: null,
            originalPicture: null,
        };
        this.fileChange = this.fileChange.bind(this);
        this.updateImage = this.updateImage.bind(this);
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
            this.setState({ originalPicture: picture, picture });
        })
    }

    updateImage(fn) {
        const picture = fn(this.state.picture);
        // console.log(this.state.picture);
        // console.log(fn);
        this.setState({ picture });
    }

    render() {
        return (
            <div className="App">
                <div className="menu">menu</div>
                <div className="app-shell">
                    <div className="images">
                        <div className="images-row image-modified">
                            <div className="histogram-wrapper">
                                <Histogram data={this.state.picture} />
                            </div>
                            <div className="image-wrapper">
                                <Image data={this.state.picture}/>
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
                        aside
                        <Lighten updateImage={this.updateImage} />
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
