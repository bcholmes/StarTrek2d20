import React from "react";
import { connect } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router";
import { withTranslation, WithTranslation } from 'react-i18next';
import { Header } from "../../components/header";
import { Character, CharacterRank } from "../../common/character";
import { navigateTo } from "../../common/navigator";
import { PageIdentity } from "../../pages/pageIdentity";
import { Button } from "../../components/button";
import store from "../../state/store";
import { modifyCharacterRank } from "../../state/characterActions";
import { Rank, RanksHelper } from "../../helpers/ranks";
import { DropDownElement, DropDownSelect } from "../../components/dropDownInput";

interface IPromotionPageProperties extends WithTranslation {
    character?: Character;
    history: RouteComponentProps["history"];
}

interface IPromotionPageState {
    rank?: Rank
    rankName?: string
}

class PromotionPage extends React.Component<IPromotionPageProperties, IPromotionPageState> {

    constructor(props) {
        super(props);

        this.state = {
            rank: this.props.character?.rank?.id,
            rankName: this.props.character?.rank?.name
        };
    }

    render() {
        const { t } = this.props;
        return (<div className="page container ml-0">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => this.goToHome(e)}>{t('Page.title.home')}</a></li>
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.ModificationTypeSelection)}>{t('Page.title.modificationTypeSelection')}</a></li>
                    <li className="breadcrumb-item active" aria-current="page">{t('Page.title.promotion')}</li>
                </ol>
            </nav>

            <Header>{t('Page.title.promotion')}</Header>
            <p>{t('PromotionPage.instruction')}</p>

            <DropDownSelect items={this.getRanks()} onChange={(id) => {
                    let allRanks = RanksHelper.instance().getRanks(this.props.character, false);
                    let rank = allRanks.filter(r => r.id === id)[0];
                    this.setState((state) => ({
                            ...state,
                            rank: rank.id,
                            rankName: rank.name
                        }))}}
                        defaultValue={this.state.rank || ""}/>

            <div className="mt-4 text-right">
                <Button buttonType={true} onClick={() => this.nextPage()} className="btn btn-primary btn-sm">{t('Common.button.next')}</Button>
            </div>

        </div>);
    }

    getRanks() {
        return RanksHelper.instance().getRanks(this.props.character, false).map(r => new DropDownElement(r.id, r.name));
    }

    nextPage() {
        store.dispatch(modifyCharacterRank(new CharacterRank(this.state.rankName, this.state.rank)));
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
