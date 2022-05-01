import React from "react";
import { Header } from "../../components/header";
import { IPageProperties } from "../../pages/iPageProperties";
import { Star, StarSystem } from "../table/star";

interface ISystemViewProperties extends IPageProperties {
    system?: StarSystem;
}

class SystemView extends React.Component<ISystemViewProperties, {}> {

    render() {
        return  this.props.system ? (<div className="mb-4">
            <Header level={2} className="mb-4">{this.props.system.id}</Header>
            <div className="row">
                <div className="col-md-4 view-field-label pb-2">Spectral Class:</div>
                <div className="col-md-8 text-white">
                    <div className="view-border-bottom pb-2">
                        {this.props.system.star ? this.props.system.star.description : ""}
                    </div>
                </div>
            </div>
        </div>) : null;
    }
}

export default SystemView;