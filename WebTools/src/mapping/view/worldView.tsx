import React from "react";
import { IPageProperties } from "../../pages/iPageProperties";
import { AsteroidBeltDetails, StandardWorldDetails, StarSystem, World, WorldClass, WorldDetails } from "../table/star";

interface IWorldViewProperties extends IPageProperties {
    world: World;
    system: StarSystem;
}

export enum WorldCoreType {
    Heavy, Molten, Rocky, Icy
}

class WorldView extends React.Component<IWorldViewProperties, {}> {

    render() {
        let classification = "Class " + WorldClass[this.props.world.worldClass.id];
        if (this.props.world.worldClass.id === WorldClass.AsteroidBelt) {
            classification = this.props.world.worldClass.description;
        } else {
            classification += " (" + this.props.world.worldClass.description + ")";
        }

        return (<div className="mb-5">
            
            {this.renderDesignation()}
            <div className="row">
                <div className="col-md-4 view-field-label pb-2">Classification:</div>
                <div className="col-md-8 text-white">
                    <div className="view-border-bottom pb-2">
                        {classification}
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
                <div className="col-md-4 view-field-label pb-2">Orbital Period</div>
                <div className="col-md-8 text-white">
                    <div className="view-border-bottom pb-2">
                        {this.props.world.period.toFixed(3) + ' Earth Years'}
                    </div>
                </div>
            </div>
            {this.renderSatellites()}
            {this.renderSize(this.props.world)}
            {this.renderDetails(this.props.world.worldDetails)}
            {this.renderCore(this.props.world)}
        </div>);
    }

    renderDetails(worldDetails: WorldDetails) {
        if (worldDetails == null) {
            return undefined;
        } else if (worldDetails instanceof AsteroidBeltDetails) {
            let details = worldDetails as AsteroidBeltDetails;

            let sizeDetails = details.asteroidSize == null ? undefined :
                (<div className="row">
                <div className="col-md-4 view-field-label pb-2">Predominant Size:</div>
                <div className="col-md-8 text-white">
                    <div className="view-border-bottom pb-2">
                        {(details.asteroidSize >= 1000 ? ((details.asteroidSize / 1000).toFixed(0) + "km") : (details.asteroidSize.toFixed(0) + "m")) 
                            + " Diameter" }
                    </div>
                </div>
            </div>);
            return sizeDetails;
        } else if (worldDetails instanceof StandardWorldDetails) {
            let details = worldDetails as StandardWorldDetails;

            let rotationDetails = details.rotationPeriod == null ? undefined :
                    (<div className="row">
                    <div className="col-md-4 view-field-label pb-2">Rotation</div>
                    <div className="col-md-8 text-white">
                        <div className="view-border-bottom pb-2">
                            {details.rotationPeriod.toFixed(2) + " hours" + (details.retrograde ? " (retrograde)" : "")}
                        </div>
                    </div>
                </div>);
            let tidallyLocked = details.tidallyLocked ? 
                (<div className="row">
                    <div className="col-md-4 view-field-label pb-2">Rotation</div>
                    <div className="col-md-8 text-white">
                        <div className="view-border-bottom pb-2">
                            Tidally Locked
                        </div>
                    </div>
                </div>) : undefined;
            let waterDetails = details.hydrographicPercentage == null ? undefined :
                (<div className="row">
                    <div className="col-md-4 view-field-label pb-2">Water coverage</div>
                    <div className="col-md-8 text-white">
                        <div className="view-border-bottom pb-2">
                            {details.hydrographicPercentage.toFixed(2) + '%'}
                        </div>
                    </div>
                </div>);
            return (<div>
                {rotationDetails}
                {tidallyLocked}
                {waterDetails}
            </div>);
        } else {
            return undefined;
        }
    }

    renderSize(world: World) {
        if (world == null) {
            return undefined;
        } else {
            let diameterDetails = world.diameter == null ? undefined :
                (<div className="row">
                <div className="col-md-4 view-field-label pb-2">Diameter</div>
                <div className="col-md-8 text-white">
                    <div className="view-border-bottom pb-2">
                        {Math.round(world.diameter).toLocaleString("en-US") + " km"}
                    </div>
                </div>
            </div>);
            let densityDetails = world.density == null ? undefined :
                (<div className="row">
                <div className="col-md-4 view-field-label pb-2">Density</div>
                <div className="col-md-8 text-white">
                    <div className="view-border-bottom pb-2">
                        {world.density.toFixed(2) + " Earth"}
                    </div>
                </div>
            </div>);
            let massDetails = world.mass == null ? undefined :
                (<div className="row">
                <div className="col-md-4 view-field-label pb-2">Mass</div>
                <div className="col-md-8 text-white">
                    <div className="view-border-bottom pb-2">
                        {(world.mass >= 1000 ? Math.round(world.mass).toLocaleString("en-US") : world.mass.toFixed(2)) + " Earth"}
                    </div>
                </div>
            </div>);
            let gravityDetails = world.gravity == null ? undefined :
                (<div className="row">
                <div className="col-md-4 view-field-label pb-2">Gravity</div>
                <div className="col-md-8 text-white">
                    <div className="view-border-bottom pb-2">
                        {(world.gravity.toFixed(2)) + " G"}
                    </div>
                </div>
            </div>);
        return (<div>
                    {diameterDetails}
                    {densityDetails}
                    {massDetails}
                    {gravityDetails}
                </div>);
        }
    }

    renderCore(world: World) {
        if (world.coreType == null) {
            return undefined;
        } else {
            return (<div className="row">
                <div className="col-md-4 view-field-label pb-2">Core:</div>
                <div className="col-md-8 text-white">
                    <div className="view-border-bottom pb-2">
                        {WorldCoreType[world.coreType]}
                    </div>
                </div>
            </div>);
        }
    }

    renderSatellites() {
        if (this.props.world.worldClass.id === WorldClass.AsteroidBelt) {
            return undefined;
        } else {
            return (<div className="row">
                <div className="col-md-4 view-field-label pb-2">Satellites:</div>
                <div className="col-md-8 text-white">
                    <div className="view-border-bottom pb-2">
                        {this.props.world.numberOfSatellites}
                    </div>
                </div>
            </div>);
        }
    }

    renderDesignation() {
        if (this.props.world && this.props.world.orbit != null) {
            return (<div className="row">
                        <div className="col-md-4 view-field-label pb-2">Designation:</div>
                        <div className="col-md-8 text-white">
                            <div className="view-border-bottom pb-2">
                                {(this.props.system.friendlyName ? this.props.system.friendlyName + ' ' : '') + this.props.world.orbitLabel}
                            </div>
                        </div>
                    </div>);
        } else {
            return undefined;
        }
    }
}

export default WorldView;