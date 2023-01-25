import React from "react";
import { connect } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router";
import { withTranslation, WithTranslation } from 'react-i18next';
import { Character } from "../../common/character";
import { Header } from "../../components/header";
import { Button } from "../../components/button";
import { DropDownInput, DropDownElement  } from "../../components/dropDownInput";
import Modifications, { ModificationType } from "../model/modificationType";
import Milestones, { MilestoneType } from "../model/milestoneType";
import { navigateTo } from "../../common/navigator";
import { PageIdentity } from "../../pages/pageIdentity";

interface ModificationTypeSelectionPageProperties extends WithTranslation {
    character?: Character;
    isModified: boolean;
    history: RouteComponentProps["history"];
}

interface ModificationTypeSelectionPageState {
    modificationType?: ModificationType;
    milestoneType?: MilestoneType;
}

class ModificationTypeSelectionPage extends React.Component<ModificationTypeSelectionPageProperties, ModificationTypeSelectionPageState> {

    constructor(props) {
        super(props);
        this.state = {
            modificationType: ModificationType.Reputation
        };
    }

    render() {
        const { t } = this.props;
        return (<div className="page container ml-0">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="index.html" onClick={(e) => this.goToHome(e)}>{t('Page.title.home')}</a></li>
                            <li className="breadcrumb-item active" aria-current="page">{t('Page.title.modificationTypeSelection')}</li>
                        </ol>
                    </nav>

                    <Header>{t('Page.title.modificationTypeSelection')}</Header>
                    <p>{t('ModificationTypeSelectionPage.instruction')}</p>

                    <div>
                        <DropDownInput items={this.getModificationTypes()} onChange={(index) => this.setState((state) => ({
                            ...state,
                            modificationType: Modifications.instance.getItems()[index].type
                        }))} defaultValue={this.state.modificationType}/>
                    </div>

                    {this.state.modificationType === ModificationType.Milestone
                    ?  (<div className="my-4">
                            <p>{t('ModificationTypeSelectionPage.whatMilestoneType')}</p>
                            <div>
                                <DropDownInput items={this.getMilestoneTypes()} onChange={(index) => {}} defaultValue={this.state.milestoneType}/>
                            </div>
                        </div>)
                    : null}
                    <div className="my-4 text-right">
                        <Button buttonType={true} className="btn btn-primary btn-sm" onClick={() => this.nextPage()}>Next</Button>
                    </div>
                </div>);
    }

    getModificationTypes() {
        return Modifications.instance.getItems().map(t => new DropDownElement(t.type, t.localizedName));
    }

    getMilestoneTypes() {
        return Milestones.instance.getItems().map(t => new DropDownElement(t.type, t.localizedName));
    }

    nextPage() {
        if (this.state.modificationType === ModificationType.Reputation) {
            navigateTo(null, PageIdentity.ReputationChange);
        } else if (this.state.modificationType === ModificationType.Promotion) {
            navigateTo(null, PageIdentity.Promotion);
        }
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
        character: state.character.currentCharacter,
        isModified: state.character.isModified
    };
}

export default withTranslation()(withRouter(connect(mapStateToProps)(ModificationTypeSelectionPage)));