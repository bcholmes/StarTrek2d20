import React from "react";
import { IPageProperties } from "../../pages/iPageProperties";
import { StarSystem, World, WorldClass } from "../table/star";

interface IWorldViewProperties extends IPageProperties {
    world: World;
    system: StarSystem;
}

class WorldView extends React.Component<IWorldViewProperties, {}> {

    render() {
        let classification = "Class " + WorldClass[this.props.world.worldClass.id];
        if (this.props.world.worldClass.id === WorldClass.AsteroidBelt) {
            classification = this.props.world.worldClass.description;
        } else {
            classification += " (" + this.props.world.worldClass.description + ")";
        }

        return (<div className="mb-4">
            <div className="row">
                <div className="col-md-4 view-field-label pb-2">Designation:</div>
                <div className="col-md-8 text-white">
                    <div className="view-border-bottom pb-2">
                        {(this.props.system.friendlyName ? this.props.system.friendlyName + ' ' : '') + this.props.world.orbitLabel}
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-4 view-field-label pb-2">Orbital Radius (AUs):</div>
                <div className="col-md-8 text-white">
                    <div className="view-border-bottom pb-2">
                        {this.props.world.orbitalRadius.toFixed(2)}
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-4 view-field-label pb-2">Classification:</div>
                <div className="col-md-8 text-white">
                    <div className="view-border-bottom pb-2">
                        {classification}
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-4 view-field-label pb-2">Satellites:</div>
                <div className="col-md-8 text-white">
                    <div className="view-border-bottom pb-2">
                        {this.props.world.numberOfSatellites}
                    </div>
                </div>
            </div>
        </div>);
    }
}

export default WorldView;