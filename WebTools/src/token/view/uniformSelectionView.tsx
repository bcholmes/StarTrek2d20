import React from "react";
import { UniformEra, UniformEraHelper } from "../model/uniformEra";
import ColorSelection from "./colorSelection";
import { DivisionColors } from "../model/divisionColors";
import { DropDownElement, DropDownSelect } from "../../components/dropDownInput";
import store from "../../state/store";
import { setTokenDivisionColor } from "../../state/tokenActions";

class UniformSelectionView extends React.Component {

    render() {
        const era = UniformEra.DominionWar;

        return (<div className="mt-4">
            <DropDownSelect items={this.uniformErasList()} defaultValue={UniformEra.DominionWar} onChange={() => {}} />

            <ColorSelection colors={DivisionColors.getColors(era)} onSelection={(c) => store.dispatch(setTokenDivisionColor(c))} />
        </div>);
    }

    uniformErasList() {
        return UniformEraHelper.instance.types.map(u => new DropDownElement(u.id, u.name));
    }
}

export default UniformSelectionView;