import React from "react";
import { withRouter, RouteComponentProps } from "react-router";
import { withTranslation, WithTranslation } from 'react-i18next';
import StarshipView from "./starshipView"
import SupportingCharacterView from "./supportingCharacterView";
import { marshaller } from "../helpers/marshaller";
import MainCharacterView from "./mainCharacterView";
import LcarsFrame from "../components/lcarsFrame";
import { PageIdentity } from "../pages/pageIdentity";

interface IViewSheetPageProperties extends WithTranslation {
    history: RouteComponentProps["history"];
}

class ViewSheetPage extends React.Component<IViewSheetPageProperties, {}> {

    render() {
        return (<LcarsFrame activePage={PageIdentity.ViewSheet}>
                <div id="app">
                    {this.renderContents()}
                </div>
            </LcarsFrame>);
    }


    renderContents() {
        let url = new URL(window.location.href);
        let query = new URLSearchParams(url.search);
        let encodedSheet = query.get('s');

        let json = marshaller.decode(encodedSheet);

        const { t } = this.props;

        if (!json) {
            return (<div className="page text-white">{t('ViewPage.errorMessage')}</div>);
        } else if (json.stereotype === "starship") {
            return (<div className="page container ml-0">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => this.goToHome(e)}>{t('Page.title.home')}</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{t('ViewPage.viewStarship')}</li>
                    </ol>
                </nav>
                <StarshipView starship={marshaller.decodeStarship(encodedSheet)}/>
            </div>);
        } else if (json.stereotype === "supportingCharacter") {
            return (<div className="page container ml-0">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="index.html" onClick={(e) => this.goToHome(e)}>{t('Page.title.home')}</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{t('ViewPage.viewSupportingCharacter')}</li>
                    </ol>
                </nav>
                <SupportingCharacterView character={marshaller.decodeCharacter(json)} />
            </div>);
        } else if (json.stereotype === "mainCharacter") {
            return (<div className="page container ml-0">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => this.goToHome(e)}>{t('Page.title.home')}</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{t('ViewPage.viewMainCharacter')}</li>
                    </ol>
                </nav>
                <MainCharacterView character={marshaller.decodeCharacter(json)} />
            </div>);
        }
    }

    goToHome(e: React.MouseEvent<HTMLAnchorElement>) {
        e.preventDefault();
        e.stopPropagation();

        const { history } = this.props;
        history.push("/");
    }
}

export default withTranslation()(withRouter(ViewSheetPage));