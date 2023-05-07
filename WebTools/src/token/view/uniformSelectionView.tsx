import React from "react";
import { UniformEra, UniformEraHelper } from "../model/uniformEra";
import ColorSelection from "./colorSelection";
import { DivisionColors } from "../model/divisionColors";
import { DropDownElement, DropDownSelect } from "../../components/dropDownInput";
import store from "../../state/store";
import { setTokenDivisionColor, setTokenRank } from "../../state/tokenActions";
import RankIndicatorCatalog from "../model/rankIndicatorCatalog";
import SwatchButton from "./swatchButton";
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from "react-redux";
import { Token } from "../model/token";

interface IUniformSelectionViewProperties {
    token: Token;
}

class UniformSelectionView extends React.Component<IUniformSelectionViewProperties, {}> {

    render() {
        const era = UniformEra.DominionWar;

        return (<div className="mt-4">
            <p>Uniform type:</p>
            <DropDownSelect items={this.uniformErasList()} defaultValue={UniformEra.DominionWar} onChange={() => {}} />

            <p className="mt-4">Division colors:</p>
            <ColorSelection colors={DivisionColors.getColors(era)} onSelection={(c) => store.dispatch(setTokenDivisionColor(c))} />

            <p className="mt-4">Rank:</p>
            <div className="d-flex" style={{gap: "0.5rem"}}>
            {RankIndicatorCatalog.instance.tngSwatches.map(s => <SwatchButton svg={s.svg} title={s.name}
                onClick={() => store.dispatch(setTokenRank(s.id))} active={this.props.token.rankIndicator === s.id}
                key={'rank-swatch-' + s.id }/>)}
            </div>
        </div>);
    }

    uniformErasList() {
        return UniformEraHelper.instance.types.map(u => new DropDownElement(u.id, u.name));
    }
}

function mapStateToProps(state, ownProps) {
    return {
        token: state.token
    };
}

export default withTranslation()(connect(mapStateToProps)(UniformSelectionView));