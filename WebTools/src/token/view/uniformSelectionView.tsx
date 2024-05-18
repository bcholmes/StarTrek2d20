import React from "react";
import { UniformEra, UniformEraHelper } from "../model/uniformEra";
import ColorSelection from "./colorSelection";
import { DivisionColors } from "../model/divisionColors";
import { DropDownElement, DropDownSelect } from "../../components/dropDownInput";
import store from "../../state/store";
import { setTokenBodyType, setTokenDivisionColor, setTokenRank, setTokenUniformVariantType, setUniformEra } from "../../state/tokenActions";
import RankIndicatorCatalog from "../model/rankIndicatorCatalog";
import SwatchButton from "./swatchButton";
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from "react-redux";
import { Token } from "../model/token";
import UniformCatalog from "../model/uniformCatalog";
import UniformVariantRestrictions from "../model/uniformVariantRestrictions";
import SpeciesRestrictions from "../model/speciesRestrictions";

interface IUniformSelectionViewProperties extends WithTranslation {
    token: Token;
    loadPack: (era: UniformEra) => void;
    isLoading: boolean;
}

class UniformSelectionView extends React.Component<IUniformSelectionViewProperties, {}> {

    handleUniformEraChange(era: UniformEra) {
        const { loadPack } = this.props;
        loadPack(era);
        store.dispatch(setUniformEra(era));
    }

    render() {
        const { t, token, isLoading } = this.props;
        const ranks = RankIndicatorCatalog.instance.getSwatches(token);

        if (isLoading) {
            return (<div className="mt-4 text-center">
                    <div className="spinner-border text-light" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>);
        } else {

            return (<div className="mt-4">
                <div className="row align-items-start">
                    <div className="col-lg-6 mb-3">
                        <p>{t('TokenCreator.section.body.uniform')}:</p>
                        <DropDownSelect items={this.uniformErasList(token)} defaultValue={token.uniformEra}
                            onChange={(era) => this.handleUniformEraChange(era as UniformEra)} />
                    </div>
                    <div className="col-lg-6 mb-3">
                        {DivisionColors.isDivisionColorsSupported(token.uniformEra) ?
                        (<>
                            <p>{t('TokenCreator.section.body.colour')}:</p>
                            <ColorSelection colors={DivisionColors.getColors(token.uniformEra)} onSelection={(c) => store.dispatch(setTokenDivisionColor(c))} />
                        </>)
                        : undefined}
                    </div>
                </div>

                {ranks?.length <= 1
                    ? undefined
                    : (<>
                        <p className="mt-4">{t('TokenCreator.section.body.rank')}:</p>
                        <div className="d-flex flex-wrap" style={{gap: "0.5rem"}}>
                        {ranks.map(s => <SwatchButton svg={s.svg} title={s.localizedName}
                            onClick={() => store.dispatch(setTokenRank(s.id))}
                            active={token.rankIndicator === s.id}
                            token={token} key={'rank-swatch-' + s.id }/>)}
                        </div>
                    </>)}

                <p className="mt-4">{t('TokenCreator.section.body.type')}:</p>
                <div className="d-flex flex-wrap" style={{gap: "0.5rem"}}>
                {UniformCatalog.instance.getSwatches(token.uniformEra).map(s => <SwatchButton svg={s.svg} title={s.localizedName} size="lg"
                    onClick={() => store.dispatch(setTokenBodyType(s.id)) }
                    active={token.bodyType === s.id} token={token} key={'body-swatch-' + s.id }/>)}
                </div>

                {this.renderVariants()}
            </div>);
        }
    }

    renderVariants() {
        const { t, token } = this.props;
        if (UniformVariantRestrictions.isVariantOptionsAvailable(token)) {
            return (<>
                <p className="mt-4">{t('TokenCreator.section.body.uniformVariant')}:</p>
                <div className="d-flex flex-wrap" style={{gap: "0.5rem"}}>
                {UniformCatalog.instance.getUniformVariantSwatches(token).map(s => <SwatchButton svg={s.svg} title={s.localizedName} size="lg"
                    onClick={() => store.dispatch(setTokenUniformVariantType(s.id)) }
                    active={token.variant === s.id} token={token} key={'variant-swatch-' + s.id }/>)}
                </div>
            </>);
        } else {
            return null;
        }
    }

    uniformErasList(token: Token) {
        let uniformTypes = SpeciesRestrictions.getUniformTypes(token.species);
        return UniformEraHelper.instance.types.filter(u => uniformTypes.indexOf(u.id) >= 0).map(u => new DropDownElement(u.id, u.localizedName));
    }
}

function mapStateToProps(state, ownProps) {
    return {
        token: state.token
    };
}

export default withTranslation()(connect(mapStateToProps)(UniformSelectionView));