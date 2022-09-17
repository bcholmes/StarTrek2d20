import React from "react";
import { Header } from "../../components/header";
import { IPageProperties } from "../../pages/iPageProperties";
import { Star } from "../table/star";
import { CompanionType } from "../table/starSystem";
import { DataValueRow } from "./dataValueRow";

interface IStarViewProperties extends IPageProperties {
    star?: Star;
    title: string;
    companionType?: CompanionType;
}

class StarView extends React.Component<IStarViewProperties, {}> {

    render() {
        return  this.props.star ? (<div className="col mb-4 pr-3">
            <Header level={2} className="mb-4">{this.props.title}</Header>
            <DataValueRow name="Spectral Class:">{this.props.star ? this.props.star.description : ""}</DataValueRow>
            {this.renderCompanionType()}
            <DataValueRow name="Mass:">{this.props.star ? (this.props.star.mass.toFixed(2) + " Sols") : ""}</DataValueRow>
            <DataValueRow name="Mass:"><span>{this.renderMassInKg()}<span> kg</span></span></DataValueRow>
            {this.renderLuminosity()}
        </div>) : null;
    }

    renderCompanionType() {
        if (this.props.companionType == null) {
            return undefined;
        } else {
            return (<DataValueRow name="Companion Type:">{this.props.companionType === CompanionType.Close ? "Close" : "Distant"}</DataValueRow>);
        }
    }

    renderLuminosity() {
        if (this.props.star.luminosityValue != null) {
            return (<DataValueRow name="Luminosity:">
                        {(this.props.star.luminosityValue > 100 ? this.props.star.luminosityValue.toFixed(0) : this.props.star.luminosityValue.toFixed(4)) + " Sols"}
                    </DataValueRow>);
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