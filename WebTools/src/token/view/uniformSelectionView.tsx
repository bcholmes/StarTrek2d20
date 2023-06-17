import React from "react";
import { UniformEra, UniformEraHelper } from "../model/uniformEra";
import ColorSelection from "./colorSelection";
import { DivisionColors } from "../model/divisionColors";
import { DropDownElement, DropDownSelect } from "../../components/dropDownInput";
import store from "../../state/store";
import { setTokenBodyType, setTokenDivisionColor, setTokenRank, setUniformEra } from "../../state/tokenActions";
import RankIndicatorCatalog from "../model/rankIndicatorCatalog";
import SwatchButton from "./swatchButton";
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from "react-redux";
import { Token } from "../model/token";
import UniformCatalog from "../model/uniformCatalog";

interface IUniformSelectionViewProperties extends WithTranslation {
    token: Token;
}

class UniformSelectionView extends React.Component<IUniformSelectionViewProperties, {}> {

    render() {
        const { t, token } = this.props;

        return (<div className="mt-4">
            <div className="row align-items-start">
                <div className="col-lg-6 mb-3">
                    <p>{t('TokenCreator.section.body.uniform')}:</p>
                    <DropDownSelect items={this.uniformErasList()} defaultValue={token.uniformEra} onChange={(e) => store.dispatch(setUniformEra(e as UniformEra))} />
                </div>
                <div className="col-lg-6 mb-3">
                    <p>{t('TokenCreator.section.body.colour')}:</p>
                    <ColorSelection colors={DivisionColors.getColors(token.uniformEra)} onSelection={(c) => store.dispatch(setTokenDivisionColor(c))} />
                </div>
            </div>

            <p className="mt-4">{t('TokenCreator.section.body.rank')}:</p>
            <div className="d-flex flex-wrap" style={{gap: "0.5rem"}}>
            {RankIndicatorCatalog.instance.getSwatches(token).map(s => <SwatchButton svg={s.svg} title={s.localizedName}
                onClick={() => store.dispatch(setTokenRank(s.id))}
                active={token.rankIndicator === s.id}
                token={token} key={'rank-swatch-' + s.id }/>)}
            </div>

            <p className="mt-4">{t('TokenCreator.section.body.type')}:</p>
            <div className="d-flex flex-wrap" style={{gap: "0.5rem"}}>
            {UniformCatalog.instance.getSwatches(token.uniformEra).map(s => <SwatchButton svg={s.svg} title={s.name} size="lg"
                onClick={() => store.dispatch(setTokenBodyType(s.id)) }
                active={token.bodyType === s.id} token={token} key={'body-swatch-' + s.id }/>)}
            </div>
        </div>);
    }

    uniformErasList() {
        return UniformEraHelper.instance.types.map(u => new DropDownElement(u.id, u.localizedName));
    }
}

function mapStateToProps(state, ownProps) {
    return {
        token: state.token
    };
}

export default withTranslation()(connect(mapStateToProps)(UniformSelectionView));