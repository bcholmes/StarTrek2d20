import React from "react";
import { withRouter, RouteComponentProps } from "react-router";
import { withTranslation, WithTranslation } from 'react-i18next';
import StarshipView from "./starshipView"
import SupportingCharacterView from "./supportingCharacterView";
import { marshaller } from "../helpers/marshaller";
import MainCharacterView from "./mainCharacterView";
import LcarsFrame from "../components/lcarsFrame";
import { PageIdentity } from "../pages/pageIdentity";
import { Construct } from "../common/construct";
import { Character } from "../common/character";
import NpcView from "./npcView";

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

    modifyTitle(construct: Construct) {
        if (construct.name) {
            if (construct instanceof Character && (construct as Character).rank) {
                document.title = (construct as Character).rank?.localizedName + " " + construct.name + " - STAR TREK ADVENTURES";
            } else {
                document.title = construct.name + " - STAR TREK ADVENTURES";
            }
        }
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
            let starship = marshaller.decodeStarship(encodedSheet);
            this.modifyTitle(starship);
            return (<div className="page container ml-0">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => this.goToHome(e)}>{t('Page.title.home')}</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{t('ViewPage.viewStarship')}</li>
                    </ol>
                </nav>
                <StarshipView starship={starship}/>
            </div>);
        } else if (json.stereotype === "supportingCharacter") {
            let character = marshaller.decodeCharacter(json);
            this.modifyTitle(character);
            return (<div className="page container ml-0">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="index.html" onClick={(e) => this.goToHome(e)}>{t('Page.title.home')}</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{t('ViewPage.viewSupportingCharacter')}</li>
                    </ol>
                </nav>
                <SupportingCharacterView character={character} />
            </div>);
        } else if (json.stereotype === "npc") {
            let character = marshaller.decodeCharacter(json);
            this.modifyTitle(character);
            return (<div className="page container ml-0">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="index.html" onClick={(e) => this.goToHome(e)}>{t('Page.title.home')}</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{t('ViewPage.viewNpc')}</li>
                    </ol>
                </nav>
                <NpcView character={character} />
            </div>);
        } else if (json.stereotype === "mainCharacter") {
            let character = marshaller.decodeCharacter(json);
            this.modifyTitle(character);
            return (<div className="page container ml-0">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => this.goToHome(e)}>{t('Page.title.home')}</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{t('ViewPage.viewMainCharacter')}</li>
                    </ol>
                </nav>
                <MainCharacterView character={character} />
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