import React from "react";
import { connect } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router";
import { withTranslation, WithTranslation } from 'react-i18next';
import { Header } from "../../components/header";
import { Character, setGlobalCharacter } from "../../common/character";
import { navigateTo } from "../../common/navigator";
import { PageIdentity } from "../../pages/pageIdentity";
import { Button } from "../../components/button";
import store from "../../state/store";
import { modifyCharacterRank } from "../../state/characterActions";
import { RanksHelper } from "../../helpers/ranks";
import { DropDownInput } from "../../components/dropDownInput";

interface IPromotionPageProperties extends WithTranslation {
    character?: Character;
    history: RouteComponentProps["history"];
}

interface IPromotionPageState {
    rank?: string
}

class PromotionPage extends React.Component<IPromotionPageProperties, IPromotionPageState> {

    constructor(props) {
        super(props);

        // temporary change to support the ranks, which still expect there
        // to be a global character object
        setGlobalCharacter(this.props.character);

        this.state = {
            rank: this.props.character?.rank
        };
    }

    render() {
        const { t } = this.props;
        return (<div className="page container ml-0">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => this.goToHome(e)}>{t('Page.title.home')}</a></li>
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.ReputationChange)}>{t('Page.title.modificationTypeSelection')}</a></li>
                    <li className="breadcrumb-item active" aria-current="page">{t('Page.title.promotion')}</li>
                </ol>
            </nav>

            <Header>{t('Page.title.promotion')}</Header>
            <p>{t('PromotionPage.instruction')}</p>

            <DropDownInput items={this.getRanks()} onChange={(index) => this.setState((state) => ({
                            ...state,
                            rank: this.getRanks()[index]
                        }))} defaultValue={this.state.rank || ""}/>

            <div className="mt-4 text-right">
                <Button buttonType={true} onClick={() => this.nextPage()} className="btn btn-primary btn-sm">{t('Common.button.next')}</Button>
            </div>

        </div>);
    }

    getRanks() {
        return RanksHelper.instance().getRanks(false).map(r => r.name);
    }

    nextPage() {
        store.dispatch(modifyCharacterRank(this.state.rank));
        navigateTo(null, PageIdentity.ModificationCompletePage);
    }

    goToHome(e: React.MouseEvent<HTMLAnchorElement>) {
        e.preventDefault();
        e.stopPropagation();

        const { history } = this.props;
        history.push("/");
    }
}

function mapStateToProps(state, ownProps) {
    return {
        character: state.character.currentCharacter
    };
}

export default withTranslation()(withRouter(connect(mapStateToProps)(PromotionPage)));
