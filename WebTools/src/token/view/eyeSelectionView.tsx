import React from "react";
import { Token } from "../model/token";
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from "react-redux";
import store from "../../state/store";
import { setTokenEyeColor } from "../../state/tokenActions";
import ColorSelection from "./colorSelection";
import SpeciesOptions from "../model/speciesOptions";

interface IEyeSelectionViewProperties extends WithTranslation {
    token: Token;
}

class EyeSelectionView extends React.Component<IEyeSelectionViewProperties, {}> {

    render() {
        const { token } = this.props;
        return (<>
            <p className="mt-4">Eye Color:</p>
            <ColorSelection colors={SpeciesOptions.getEyeColors(token.species)} onSelection={(c) => store.dispatch(setTokenEyeColor(c))} />

            <p className="mt-4">Eye Style:</p>
            <div className="d-flex flex-wrap" style={{gap: "0.5rem"}}>
            </div>
        </>)
    }

}


function mapStateToProps(state, ownProps) {
    return {
        token: state.token
    };
}

export default withTranslation()(connect(mapStateToProps)(EyeSelectionView));