import React from "react";
import { Button } from "../../components/button";
import { Header } from "../../components/header";
import { IPageProperties } from "../../pages/iPageProperties";
import { NotableSpatialPhenomenonModel, StarSystem } from "../table/star";

interface INotablePhenomenonViewProperties extends IPageProperties {
    phenomenon?: NotableSpatialPhenomenonModel;
}

class NotablePhenomenonView extends React.Component<INotablePhenomenonViewProperties, {}> {

    render() {
        return  this.props.phenomenon ? (<div className="mb-4">
                <Header level={2} className="mb-4">Notable Phenomenon</Header>
                <div className="row">
                <div className="col-md-4 view-field-label pb-2">Phenomenon:</div>
                <div className="col-md-8 text-white">
                    <div className="view-border-bottom pb-2">
                        {this.props.phenomenon.name}
                    </div>
                </div>
            </div>
        </div>) : null;
    }
}

export default NotablePhenomenonView;