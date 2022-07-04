import React from "react";
import { Header } from "../../components/header";
import { IPageProperties } from "../../pages/iPageProperties";
import { Star } from "../table/star";

interface IStarViewProperties extends IPageProperties {
    star?: Star;
    title: string;
}

class StarView extends React.Component<IStarViewProperties, {}> {

    render() {
        return  this.props.star ? (<div className="mb-4">
            <Header level={2} className="mb-4">{this.props.title}</Header>
            <div className="row">
                <div className="col-md-4 view-field-label pb-2">Spectral Class:</div>
                <div className="col-md-8 text-white">
                    <div className="view-border-bottom pb-2">
                        {this.props.star ? this.props.star.description : ""}
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-4 view-field-label pb-2">Mass (Sols):</div>
                <div className="col-md-8 text-white">
                    <div className="view-border-bottom pb-2">
                        {this.props.star ? this.props.star.mass.toFixed(2) : ""}
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-4 view-field-label pb-2">Mass (kg):</div>
                <div className="col-md-8 text-white">
                    <div className="view-border-bottom pb-2">
                        {this.renderMassInKg()}
                    </div>
                </div>
            </div>
            {this.renderLuminosity()}
        </div>) : null;
    }

    renderLuminosity() {
        if (this.props.star.luminosityValue != null) {
            return (<div className="row">
                <div className="col-md-4 view-field-label pb-2">Luminosity (Sols):</div>
                <div className="col-md-8 text-white">
                    <div className="view-border-bottom pb-2">
                        {this.props.star.luminosityValue > 1 ? this.props.star.luminosityValue.toFixed(0) : this.props.star.luminosityValue.toFixed(4)}
                    </div>
                </div>
            </div>);
        } else {
            return undefined;
        }
    }

    renderMassInKg() {
        let mass = (1.98847 *  this.props.star.mass).toFixed(4);
        return (<span>{mass} x 10<sup>30</sup></span>);
    }
}

export default StarView;