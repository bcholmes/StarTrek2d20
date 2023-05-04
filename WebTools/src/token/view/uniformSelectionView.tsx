import React from "react";
import { UniformEra } from "../model/uniformEra";
import ColorSelection from "./colorSelection";
import { DivisionColors } from "../model/divisionColors";

class UniformSelectionView extends React.Component {

    render() {
        const era = UniformEra.DominionWar;

        return (<div>
            <ColorSelection colors={DivisionColors.getColors(era)} onSelection={() => {}} />
        </div>);
    }

}

export default UniformSelectionView;