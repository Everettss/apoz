import React, { Component } from 'react';
import ImportImage from '../../../ImportImage/ImportImage';
import { forEachPixel2Images } from '../../../utils/helpers';

const logicalTransformation = (rule, M = 256) => (image1, image2) => {
    forEachPixel2Images(image1, image2, (pixel1, pixel2) => {
        if (rule === 'OR') {
            return pixel1 | pixel2;
        } else if (rule === 'AND') {
            return pixel1 & pixel2;
        } else if (rule === 'XOR') {
            return pixel1 ^ pixel2;
        } else {
            return pixel1;
        }

    });

    return {
        title: `logical ${rule}`,
        picture: image1
    };
};

class Logical extends Component {
    constructor(props) {
        super(props);
        this.state = {
            importedSecondImage: false,
            err: false,
            rule: 'OR'
        };

        this.formHandler = this.formHandler.bind(this);
        this.radioHandler = this.radioHandler.bind(this);
        this.importHandler = this.importHandler.bind(this);
    }

    formHandler(e) {
        e.preventDefault();
        this.props.updateImage(logicalTransformation(this.state.rule));
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
                <h3 className="aside__item__title">Logical</h3>
                {
                    this.state.importedSecondImage ?
                    <form action="#" onSubmit={this.formHandler}>
                        <div onChange={this.radioHandler}>
                            <input
                                type="radio"
                                value="OR"
                                name="type"
                                defaultChecked={this.state.rule === 'OR'}
                            /> OR <br />
                            <input
                                type="radio"
                                value="AND"
                                name="type"
                                defaultChecked={this.state.rule === 'AND'}
                            /> AND <br />
                            <input
                                type="radio"
                                value="XOR"
                                name="type"
                                defaultChecked={this.state.rule === 'XOR'}
                            /> XOR <br />
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

export default Logical;
export { logicalTransformation };
