import React from "react";
import { Token } from "../model/token";
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from "react-redux";
import SwatchButton from "./swatchButton";
import MouthCatalog from "../model/mouthCatalog";
import store from "../../state/store";
import { setTokenFacialHairTypes, setTokenLipstickColor, setTokenMouthType } from "../../state/tokenActions";
import ColorSelection from "./colorSelection";
import SpeciesOptions from "../model/speciesOptions";
import FacialHairCatalog from "../model/facialHairCatalog";
import { FacialHairType } from "../model/facialHairEnum";

interface IMouthSelectionViewProperties extends WithTranslation {
    token: Token;
}

class MouthSelectionView extends React.Component<IMouthSelectionViewProperties, {}> {

    render() {
        const { token } = this.props;
        return (<>
            <p className="mt-4">Mouth:</p>
            <div className="d-flex flex-wrap" style={{gap: "0.5rem"}}>
            {MouthCatalog.instance.getSwatches(token).map(s => <SwatchButton svg={s.svg} title={s.name}
                onClick={() => store.dispatch(setTokenMouthType(s.id))} active={s.id === token.mouthType}
                token={token}
                key={'mouth-swatch-' + s.id }/>)}
            </div>

            <p className="mt-4">Lipstick Color:</p>
            <ColorSelection colors={SpeciesOptions.getLipstickColors(token.species)} onSelection={(c) => store.dispatch(setTokenLipstickColor(c))} />

            <p className="mt-4">Facial Hair:</p>
            <div className="d-flex flex-wrap" style={{gap: "0.5rem"}}>
            {FacialHairCatalog.instance.getSwatches(token).map(s => <SwatchButton svg={s.svg} title={s.name}
                onClick={() => this.addFacialHairType(token, s.id)} active={token.facialHairType.indexOf(s.id) >= 0}
                token={token}
                key={'facial-hair-swatch-' + s.id }/>)}
            </div>

        </>);
    }

    addFacialHairType(token: Token, type: FacialHairType) {
        store.dispatch(setTokenFacialHairTypes([type]));
    }

}


function mapStateToProps(state, ownProps) {
    return {
        token: state.token
    };
}

export default withTranslation()(connect(mapStateToProps)(MouthSelectionView));