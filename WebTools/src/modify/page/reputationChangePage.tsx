import React from "react";
import { connect } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router";
import { withTranslation, WithTranslation } from 'react-i18next';
import { Header } from "../../components/header";
import { Character } from "../../common/character";
import { navigateTo } from "../../common/navigator";
import { PageIdentity } from "../../pages/pageIdentity";
import { StatControl } from "../../starship/view/statControl";
import { Button } from "../../components/button";
import store from "../../state/store";
import { modifyCharacterReputation } from "../../state/characterActions";

interface ReputationChangePageProperties extends WithTranslation {
    character?: Character;
    history: RouteComponentProps["history"];
}

interface ReputationChangePageState {
    delta: number
}

class ReputationChangePage extends React.Component<ReputationChangePageProperties, ReputationChangePageState> {

    constructor(props) {
        super(props);
        this.state = {
            delta: 0
        };
    }

    render() {
        const { t } = this.props;
        const value = (this.props.character?.reputation ?? 0) + this.state.delta;
        return (<div className="page container ml-0">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => this.goToHome(e)}>{t('Page.title.home')}</a></li>
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.ReputationChange)}>{t('Page.title.modificationTypeSelection')}</a></li>
                    <li className="breadcrumb-item active" aria-current="page">{t('Page.title.reputationChange')}</li>
                </ol>
            </nav>

            <Header>{t('Page.title.reputationChange')}</Header>
            <p>{t('ReputationChangePage.instruction')}</p>

            <StatControl statName={t('Construct.other.reputation')} value={value}
                        showIncrease={value < 20}
                        showDecrease={value > 0}
                        onIncrease={() => this.setState((state) => ({...state, delta: state.delta + 1}))}
                        onDecrease={() => this.setState((state) => ({...state, delta: state.delta - 1}))} />

            <div className="mt-4 text-right">
                <Button buttonType={true} onClick={() => this.nextPage()} className="btn btn-primary btn-sm">{t('Common.button.next')}</Button>
            </div>

        </div>);
    }

    nextPage() {
        store.dispatch(modifyCharacterReputation(this.state.delta));
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

export default withTranslation()(withRouter(connect(mapStateToProps)(ReputationChangePage)));
