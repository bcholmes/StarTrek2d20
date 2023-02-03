import React from "react";
import { Window } from "../../common/window";
import { Button } from "../../components/button";
import { IPageProperties } from "../../pages/iPageProperties";
import { StarSystem } from "../table/starSystem";

interface ISystemViewProperties extends IPageProperties {
    system?: StarSystem;
    onClick: {() : void }
}

class SystemView extends React.Component<ISystemViewProperties, {}> {

    render() {
        return  this.props.system ? (<tr  onClick={() => { if (Window.isCompact()) this.props.onClick(); }}>
            <td className="selection-header">{this.props.system.name}</td>
            <td>{this.props.system.star ? this.props.system.star.description : ""}</td>
            <td className="text-center">{this.props.system.worlds ? this.props.system.worlds.length : ""}</td>
            <td className="text-right">
                <Button buttonType={true} text="View" className="button-small" onClick={() => this.props.onClick()}/>
            </td>
        </tr>) : null;
    }
}

export default SystemView;