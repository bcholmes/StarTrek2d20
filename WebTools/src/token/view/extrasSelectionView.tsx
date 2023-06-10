import React from "react";
import { Token } from "../model/token";
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from "react-redux";
import SwatchButton from "./swatchButton";
import ExtrasCatalog from "../model/extrasCatalog";
import { ExtraCategory, ExtraType } from "../model/extrasTypeEnum";
import store from "../../state/store";
import { setTokenExtrasTypes } from "../../state/tokenActions";

interface IExtraSelectionViewProperties extends WithTranslation {
    token: Token;
}

class ExtraSelectionView extends React.Component<IExtraSelectionViewProperties, {}> {

    render() {
        const { t } = this.props;
        return (<>
        <p className="mt-4">{t('TokenCreator.section.extras.ears')}:</p>
        <div className="d-flex flex-wrap" style={{gap: "0.5rem"}}>
        {ExtrasCatalog.instance.getSwatches(this.props.token, ExtraCategory.Ear).map(s => <SwatchButton svg={s.svg} title={s.name}
            onClick={() => this.addExtra(s.id)} active={this.props.token.extras.indexOf(s.id) >= 0 || (s.id === ExtraType.None && !this.isExtraCategoryPresent(ExtraCategory.Ear))}
            token={this.props.token}
            key={'extra-swatch-ear-' + s.id }/>)}
        </div>

        </>)
    }

    isExtraCategoryPresent(category: ExtraCategory) {
        return this.props.token.extras.filter(i => ExtrasCatalog.instance.isInCategory(i, category)).length > 0;
    }

    addExtra(extraType: ExtraType) {
        store.dispatch(setTokenExtrasTypes(extraType === ExtraType.None ? [] : [ extraType ]));
    }
}


function mapStateToProps(state, ownProps) {
    return {
        token: state.token
    };
}

export default withTranslation()(connect(mapStateToProps)(ExtraSelectionView));