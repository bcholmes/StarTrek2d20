import React from "react";
import { Token } from "../model/token";
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from "react-redux";
import SwatchButton from "./swatchButton";
import ExtrasCatalog from "../model/extrasCatalog";
import { ExtraCategory, ExtraType, getExtraCategory } from "../model/extrasTypeEnum";
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
        {ExtrasCatalog.instance.getSwatches(this.props.token, ExtraCategory.Ear).map(s => <SwatchButton svg={s.svg} title={s.localizedName}
            onClick={() => this.addExtra(s.id, ExtraCategory.Ear)} active={this.props.token.extras.indexOf(s.id) >= 0 || (s.id === ExtraType.None && !this.isExtraCategoryPresent(ExtraCategory.Ear))}
            token={this.props.token}
            key={'extra-swatch-ear-' + s.id }/>)}
        </div>

        <p className="mt-4">{t('TokenCreator.section.extras.forehead')}:</p>
        <div className="d-flex flex-wrap" style={{gap: "0.5rem"}}>
        {ExtrasCatalog.instance.getSwatches(this.props.token, ExtraCategory.Forehead).map(s => <SwatchButton svg={s.svg} title={s.localizedName}
            onClick={() => this.addExtra(s.id, ExtraCategory.Forehead)}
            active={this.props.token.extras.indexOf(s.id) >= 0 || (s.id === ExtraType.None && !this.isExtraCategoryPresent(ExtraCategory.Forehead))}
            token={this.props.token}
            key={'extra-swatch-forehead-' + s.id }/>)}
        </div>


        </>)
    }

    isExtraCategoryPresent(category: ExtraCategory) {
        return this.props.token.extras.filter(i => ExtrasCatalog.instance.isInCategory(i, category)).length > 0;
    }

    addExtra(extraType: ExtraType, category: ExtraCategory) {
        let current = this.props.token.extras.filter(e => getExtraCategory(e) !== category);
        if (extraType !== ExtraType.None) {
            current.push(extraType);
        }
        store.dispatch(setTokenExtrasTypes(current));
    }
}


function mapStateToProps(state, ownProps) {
    return {
        token: state.token
    };
}

export default withTranslation()(connect(mapStateToProps)(ExtraSelectionView));