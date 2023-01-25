import React from "react";
import { connect } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router";
import { withTranslation, WithTranslation } from 'react-i18next';
import { Character } from "../../common/character";
import { Header } from "../../components/header";
import { Button } from "../../components/button";
import { navigateTo } from "../../common/navigator";
import { PageIdentity } from "../../pages/pageIdentity";
import { marshaller } from "../../helpers/marshaller";
import InstructionText from "../../components/instructionText";

interface ModificationCompletePageProperties extends WithTranslation {
    character?: Character;
    history: RouteComponentProps["history"];
}

class ModificationCompletePage extends React.Component<ModificationCompletePageProperties, {}> {

    render() {
        const { t } = this.props;
        return (<div className="page container ml-0">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => this.goToHome(e)}>{t('Page.title.home')}</a></li>
                    <li className="breadcrumb-item active" aria-current="page">{t('Page.title.modificationComplete')}</li>
                </ol>
            </nav>

            <Header>{t('Page.title.modificationComplete')}</Header>
            <InstructionText text={t('ModificationCompletePage.instruction')} />

            <div className="my-4 text-right">
                <Button buttonType={true} className="btn btn-primary btn-sm mr-2" onClick={() => navigateTo(null, PageIdentity.ModificationTypeSelection)}>Modify</Button>
                <Button buttonType={true} className="btn btn-primary btn-sm" onClick={() => this.showViewPage()}>View</Button>
            </div>
        </div>);
    }

    goToHome(e: React.MouseEvent<HTMLAnchorElement>) {
        e.preventDefault();
        e.stopPropagation();

        const { history } = this.props;
        history.push("/");
    }

    showViewPage() {
        const value = marshaller.encodeMainCharacter(this.props.character);
        window.open('/view?s=' + value, "_blank");
    }
}

function mapStateToProps(state, ownProps) {
    return {
        character: state.character.currentCharacter
    };
}

export default withTranslation()(withRouter(connect(mapStateToProps)(ModificationCompletePage)));