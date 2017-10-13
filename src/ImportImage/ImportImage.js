import React, { Component } from 'react';
import './ImportImage.css'
import getPixels from 'get-pixels';
import Dropzone from 'react-dropzone'
import lenna from '../img/Lenna.png';
import coffe from '../img/Cwicz2Obraz.bmp';


class ImportImage extends Component {
    constructor(props) {
        super(props);
        this.fileChange = this.fileChange.bind(this);
    }

    componentDidMount() {
        if (this.props.importImageOnBoostrap) {
            this.importImage(lenna);
        }
    }

    fileChange(files) {
        const file = files[0];
        const url = window.URL || window.webkitURL;
        const src = url.createObjectURL(file);

        this.importImage(src);
    }

    importImage(src) {
        getPixels(src, (err, picture) => {
            if(err) {
                console.log("Bad image path");
                return
            }
            this.props.importHandler(picture);
        })
    }

    handlePreloadedImage(imgSrc) {
        return () => {
            this.importImage(imgSrc);
        }
    }

    render() {
        return (
            <div className="download__wrapper">
                <Dropzone
                    className="dropzone"
                    activeClassName="dropzone--accept"
                    rejectClassName="dropzone--reject"
                    accept="image/jpeg, image/png, image/bmp, image/tiff"
                    onDrop={accepted => { accepted.length && this.fileChange(accepted); }}
                >
                    <i className="fa fa-upload dropzone__icon" aria-hidden="true" />
                    <div className="dropzone__inner-wrapper">
                        Drop file here or click to download
                    </div>
                </Dropzone>
                <span className="download__or-choose">or choose:</span><br />
                <div className="download__images-wrapper">
                    <div
                        className="download__image"
                        style={{ backgroundImage: `url(${lenna}` }}
                        onClick={this.handlePreloadedImage(lenna)}
                    />
                    <div
                        className="download__image"
                        style={{ backgroundImage: `url(${coffe}` }}
                        onClick={this.handlePreloadedImage(coffe)}
                    />
                    {/*<div*/}
                        {/*className="download__image"*/}
                        {/*style={{ backgroundImage: `url(${lenna}` }}*/}
                        {/*onClick={this.handlePreloadedImage(lenna)}*/}
                    {/*/>*/}
                    {/*<div*/}
                        {/*className="download__image"*/}
                        {/*style={{ backgroundImage: `url(${lenna}` }}*/}
                        {/*onClick={this.handlePreloadedImage(lenna)}*/}
                    {/*/>*/}
                </div>

            </div>
        );
    }
}

export default ImportImage;
