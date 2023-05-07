import React from "react";
import { Token } from "../model/token";
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from "react-redux";
import ColorSelection from "./colorSelection";
import SpeciesColors from "../model/speciesColors";
import store from "../../state/store";
import { setTokenSkinColor } from "../../state/tokenActions";

interface IHeadSelectionViewProperties extends WithTranslation {
    token: Token;
}

class HeadSelectionView extends React.Component<IHeadSelectionViewProperties, {}> {

    render() {
        const { token } = this.props;

        return (<>
        <p className="mt-4">Skin Color:</p>
        <ColorSelection colors={SpeciesColors.getSkinColors(token.species)} onSelection={(c) => store.dispatch(setTokenSkinColor(c))} />

        </>)
    }

}


function mapStateToProps(state, ownProps) {
    return {
        token: state.token
    };
}

export default withTranslation()(connect(mapStateToProps)(HeadSelectionView));