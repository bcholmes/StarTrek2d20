import React from "react";
import { StarshipView } from "./starshipView"
import SupportingCharacterView from "./supportingCharacterView";
import { marshaller } from "../helpers/marshaller";
import MainCharacterView from "./mainCharacterView";
import { withTranslation, WithTranslation } from 'react-i18next';

class ViewSheetPage extends React.Component<WithTranslation, {}> {

    render() {
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
                    <li className="breadcrumb-item"><a href="index.html">{t('Page.title.home')}</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{t('ViewPage.viewStarship')}</li>
                    </ol>
                </nav>
                <StarshipView starship={marshaller.decodeStarship(encodedSheet)}/>
            </div>);
        } else if (json.stereotype === "supportingCharacter") {
            return (<div className="page container ml-0">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="index.html">{t('Page.title.home')}</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{t('ViewPage.viewSupportingCharacter')}</li>
                    </ol>
                </nav>
                <SupportingCharacterView character={marshaller.decodeCharacter(json)} />
            </div>);
        } else if (json.stereotype === "mainCharacter") {
            return (<div className="page container ml-0">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="index.html">{t('Page.title.home')}</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{t('ViewPage.viewMainCharacter')}</li>
                    </ol>
                </nav>
                <MainCharacterView character={marshaller.decodeCharacter(json)} />
            </div>);
        }
    }
}

export default withTranslation()(ViewSheetPage);