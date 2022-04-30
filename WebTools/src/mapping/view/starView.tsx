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
        </div>) : null;
    }
}

export default StarView;