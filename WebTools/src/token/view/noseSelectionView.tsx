import React from "react";
import { Token } from "../model/token";
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from "react-redux";
import NoseCatalog from "../model/noseCatalog";
import SwatchButton from "./swatchButton";
import store from "../../state/store";

interface INoseSelectionViewProperties extends WithTranslation {
    token: Token;
}

class NoseSelectionView extends React.Component<INoseSelectionViewProperties, {}> {

    render() {
        return (<>
        <p className="mt-4">Nose:</p>
            <div className="d-flex" style={{gap: "0.5rem"}}>
            {NoseCatalog.instance.swatches.map(s => <SwatchButton svg={s.svg} title={s.name}
                onClick={() => {}} active={true}
                key={'nose-swatch-' + s.id }/>)}
            </div>
        </>)
    }

}


function mapStateToProps(state, ownProps) {
    return {
        token: state.token
    };
}

export default withTranslation()(connect(mapStateToProps)(NoseSelectionView));