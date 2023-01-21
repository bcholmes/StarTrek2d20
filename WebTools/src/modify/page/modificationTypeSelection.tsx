import React from "react";
import { connect } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router";
import { withTranslation, WithTranslation } from 'react-i18next';
import { Character } from "../../common/character";
import { Header } from "../../components/header";
import LcarsFrame from "../../components/lcarsFrame";
import { PageIdentity } from "../../pages/pageIdentity";
import { Button } from "../../components/button";
import { DropDownInput, DropDownElement  } from "../../components/dropDownInput";
import Modifications, { ModificationType } from "../model/modificationType";

interface ModificationTypeSelectionPageProperties extends WithTranslation {
    character?: Character;
    isModified: boolean;
    history: RouteComponentProps["history"];
}

interface ModificationTypeSelectionPageState {
    modificationType?: ModificationType;
}

class ModificationTypeSelectionPage extends React.Component<ModificationTypeSelectionPageProperties, ModificationTypeSelectionPageState> {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        document.title = "Modify Character - STAR TREK ADVENTURES";
    }

    render() {
        const { t } = this.props;
        return (<LcarsFrame activePage={PageIdentity.ModificationTypeSelection}>
                <div id="app">
                    <div className="page container ml-0">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><a href="index.html" onClick={(e) => this.goToHome(e)}>{t('Page.title.home')}</a></li>
                                <li className="breadcrumb-item active" aria-current="page">{t('Page.title.modificationTypeSelection')}</li>
                            </ol>
                        </nav>

                        <Header>{t('Page.title.modificationTypeSelection')}</Header>
                        <p>Please select the modification that you want to apply to this character:</p>

                        <div>
                            <DropDownInput items={this.getModificationTypes()} onChange={(index) => {}} defaultValue={this.state.modificationType}/>
                        </div>

                        <div className="my-4 text-right">
                            <Button buttonType={true} className="btn btn-primary btn-sm" onClick={() => {}}>Next</Button>
                        </div>
                    </div>
                </div>
            </LcarsFrame>);
    }

    getModificationTypes() {
        return Modifications.instance.getItems().map(t => new DropDownElement(t.type, t.name));
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
        character: state.character.character,
        isModified: state.character.isModified
    };
}

export default withTranslation()(withRouter(connect(mapStateToProps)(ModificationTypeSelectionPage)));