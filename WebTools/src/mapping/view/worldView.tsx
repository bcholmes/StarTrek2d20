import React from "react";
import { IPageProperties } from "../../pages/iPageProperties";
import { World } from "../table/world";
import { StarSystem } from "../table/starSystem";
import { DataValueRow } from "./dataValueRow";

interface IWorldViewProperties extends IPageProperties {
    world: World;
    system: StarSystem;
}


class WorldView extends React.Component<IWorldViewProperties, {}> {

    render() {
        let { world } = this.props;
        let attributes = world.attributeList;
        return (<div className="col mb-5 pe-3">
                {attributes.map((a,i) => (<DataValueRow name={a.name + ":"} key={'attr-' + i}>{a.value}</DataValueRow>))}
            </div>);
    }
}

export default WorldView;