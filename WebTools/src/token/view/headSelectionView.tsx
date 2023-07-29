import React from "react";
import { Token } from "../model/token";
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from "react-redux";
import ColorSelection from "./colorSelection";
import SpeciesRestrictions from "../model/speciesRestrictions";
import store from "../../state/store";
import { setTokenHeadType, setTokenSkinColor } from "../../state/tokenActions";
import HeadCatalog from "../model/headCatalog";
import SwatchButton from "./swatchButton";

interface IHeadSelectionViewProperties extends WithTranslation {
    token: Token;
}

class HeadSelectionView extends React.Component<IHeadSelectionViewProperties, {}> {

    render() {
        const { t, token } = this.props;

        return (<>
            <p className="mt-4">{t('TokenCreator.section.head.colour')}:</p>
            <ColorSelection colors={SpeciesRestrictions.getSkinColors(token.species)} onSelection={(c) => store.dispatch(setTokenSkinColor(c))} />

            {SpeciesRestrictions.isRubberHeaded(token.species) ? null :
            (<>
                <p className="mt-4">{t('TokenCreator.section.head.shape')}:</p>
                <div className="d-flex flex-wrap" style={{gap: "0.5rem"}}>
                {HeadCatalog.instance.getSwatches(token).map(s => <SwatchButton svg={s.svg} title={s.localizedName} size="lg"
                    onClick={() => store.dispatch(setTokenHeadType(s.id))} active={token.headType === s.id}
                    token={token}
                    key={'head-swatch-' + s.id }/>)}
                </div>
            </>)}
        </>)
    }

}


function mapStateToProps(state, ownProps) {
    return {
        token: state.token
    };
}

export default withTranslation()(connect(mapStateToProps)(HeadSelectionView));