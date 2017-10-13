import React, { Component } from 'react';
import ImportImage from '../../../ImportImage/ImportImage';
import { forEachPixel2Images } from '../../../utils/helpers';

const arithmeticTransformation = (rule, M = 256) => (image1, image2) => {
    forEachPixel2Images(image1, image2, (pixel1, pixel2) => {
        if (rule === 'add') {
            return Math.round((pixel1 + pixel2) / 2);
        } else if (rule === 'sub') {
            return Math.abs (pixel1 - pixel2);
        } else if (rule === 'difference') {
            return pixel1 === pixel2 ? 1 : 0;
        } else {
            return pixel1;
        }

    });

    return {
        title: `arithmetic ${rule}`,
        picture: image1
    };
};

class Arithmetic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            importedSecondImage: false,
            err: false,
            rule: 'add'
        };

        this.formHandler = this.formHandler.bind(this);
        this.radioHandler = this.radioHandler.bind(this);
        this.importHandler = this.importHandler.bind(this);
    }

    formHandler(e) {
        e.preventDefault();
        this.props.updateImage(arithmeticTransformation(this.state.rule));
    }

    importHandler(image) {
        return this.props.importSecondImage(image, (err, res) => {
            if (!err) {
                this.setState({ importedSecondImage: true, err: false });
            } else {
                this.setState({ err });
            }
        });
    }

    radioHandler(event) {
        this.setState({ rule: event.target.value })
    }

    componentDidMount() {
        if (this.props.secondImage) {
            this.setState({ importedSecondImage: true });
        }
    }

    render() {
        return (
            <div>
                <h3 className="aside__item__title">Arithmetic</h3>
                {
                    this.state.importedSecondImage ?
                    <form action="#" onSubmit={this.formHandler}>
                        <div onChange={this.radioHandler}>
                            <input
                                type="radio"
                                value="add"
                                name="type"
                                defaultChecked={this.state.rule === 'add'}
                            /> Add <br />
                            <input
                                type="radio"
                                value="sub"
                                name="type"
                                defaultChecked={this.state.rule === 'sub'}
                            /> Sub <br />
                            <input
                                type="radio"
                                value="difference"
                                name="type"
                                defaultChecked={this.state.rule === 'difference'}
                            /> Difference <br />
                        </div>
                        <input type="submit" value="Apply"/>
                    </form> :
                    <div>
                        {this.state.err ? this.state.err : ''}
                        <ImportImage importHandler={this.importHandler} />
                    </div>

                }
            </div>
        );
    }
}

export default Arithmetic;
export { arithmeticTransformation };
