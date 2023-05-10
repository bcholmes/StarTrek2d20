import React from "react";
import { Token } from "../model/token";
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from "react-redux";
import SwatchButton from "./swatchButton";
import MouthCatalog from "../model/mouthCatalog";
import store from "../../state/store";
import { setTokenMouthType } from "../../state/tokenActions";

interface IMouthSelectionViewProperties extends WithTranslation {
    token: Token;
}

class MouthSelectionView extends React.Component<IMouthSelectionViewProperties, {}> {

    render() {
        return (<>
        <p className="mt-4">Mouth:</p>
            <div className="d-flex flex-wrap" style={{gap: "0.5rem"}}>
            {MouthCatalog.instance.swatches.map(s => <SwatchButton svg={s.svg} title={s.name}
                onClick={() => store.dispatch(setTokenMouthType(s.id))} active={s.id === this.props.token.mouthType}
                token={this.props.token}
                key={'mouth-swatch-' + s.id }/>)}
            </div>
        </>);
    }

}


function mapStateToProps(state, ownProps) {
    return {
        token: state.token
    };
}

export default withTranslation()(connect(mapStateToProps)(MouthSelectionView));