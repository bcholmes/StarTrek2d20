import React from "react";
import { Window } from "../../common/window";
import { Button } from "../../components/button";
import { StarSystem } from "../table/starSystem";
import { withTranslation, WithTranslation } from "react-i18next";

interface ISystemViewProperties extends WithTranslation {
    system?: StarSystem;
    onClick: {() : void }
}

class SystemView extends React.Component<ISystemViewProperties, {}> {

    render() {
        const { t } = this.props;
        return  this.props.system ? (<tr  onClick={() => { if (Window.isCompact()) this.props.onClick(); }}>
            <td className="selection-header">{this.props.system.name}</td>
            <td>{this.props.system.star ? this.props.system.star.description : ""}</td>
            <td className="text-center">{this.props.system.worlds ? this.props.system.worlds.length : ""}</td>
            <td className="text-end">
                <Button className="button-small" onClick={() => this.props.onClick()}>{t('Common.button.view')}</Button>
            </td>
        </tr>) : null;
    }
}

export default withTranslation()(SystemView);