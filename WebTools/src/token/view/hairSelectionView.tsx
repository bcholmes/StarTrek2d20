import React from "react";
import { Token } from "../model/token";
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from "react-redux";
import SwatchButton from "./swatchButton";
import HairCatalog from "../model/hairCatalog";
import store from "../../state/store";
import { setTokenHairColor, setTokenHairType } from "../../state/tokenActions";
import ColorSelection from "./colorSelection";
import SpeciesOptions from "../model/speciesOptions";

interface IHairSelectionViewProperties extends WithTranslation {
    token: Token;
}

class HairSelectionView extends React.Component<IHairSelectionViewProperties, {}> {

    render() {
        const { token } = this.props;
        return (<>
            <p className="mt-4">Hair Color:</p>
            <ColorSelection colors={SpeciesOptions.getHairColors(token.species)} onSelection={(c) => store.dispatch(setTokenHairColor(c))} />

            <p className="mt-4">Hair Style:</p>
            <div className="d-flex flex-wrap" style={{gap: "0.5rem"}}>
            {HairCatalog.instance.getSwatches(token).map(s => <SwatchButton svg={s.svg} title={s.name} size="lg"
                onClick={() => store.dispatch(setTokenHairType(s.id))} active={token.hairType === s.id}
                token={token}
                key={'hair-swatch-' + s.id }/>)}
            </div>
        </>)
    }

}


function mapStateToProps(state, ownProps) {
    return {
        token: state.token
    };
}

export default withTranslation()(connect(mapStateToProps)(HairSelectionView));