import React, { lazy } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from 'react-i18next';
import StarshipView from "./starshipView"
import SupportingCharacterView from "./supportingCharacterView";
import { marshaller } from "../helpers/marshaller";
import MainCharacterView from "./mainCharacterView";
import LcarsFrame from "../components/lcarsFrame";
import { PageIdentity } from "../pages/pageIdentity";
import { Construct } from "../common/construct";
import { Character } from "../common/character";
import NpcView from "./npcView";
import SoloCharacterView from "./soloCharacterView";
import { Asset } from "../asset/asset";

const AssetView = lazy(() => import(/* webpackChunkName: 'asset' */ '../asset/view/assetView'));


const ViewSheetPage = () => {

    const { t } = useTranslation();
    const navigate = useNavigate();

    const modifyTitle = (construct: Construct) => {
        if (construct.name) {
            if (construct instanceof Character && (construct as Character).rank) {
                document.title = (construct as Character).rank?.localizedName + " " + construct.name + " - STAR TREK ADVENTURES";
            } else {
                document.title = construct.name + " - STAR TREK ADVENTURES";
            }
        }
    }

    const modifyTitleForAsset = (asset: Asset) => {
        if (asset.name) {
            document.title = asset.name + " - STAR TREK ADVENTURES";
        }
    }

    const renderContents = () => {
        let url = new URL(window.location.href);
        let query = new URLSearchParams(url.search);
        let encodedSheet = query.get('s');

        let json = marshaller.decode(encodedSheet);

        if (!json) {
            return (<div className="page text-white">{t('ViewPage.errorMessage')}</div>);
        } else if (json.stereotype === "asset") {
            let asset = marshaller.decodeAsset(encodedSheet);
            modifyTitleForAsset(asset);
            return (<div className="page container ms-0">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/index.html" onClick={(e) => goToHome(e)}>{t('Page.title.home')}</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{t('ViewPage.viewAsset')}</li>
                    </ol>
                </nav>
                <AssetView asset={asset}/>
            </div>);
        } else if (json.stereotype === "starship") {
            let starship = marshaller.decodeStarship(encodedSheet);
            modifyTitle(starship);
            return (<div className="page container ms-0">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/index.html" onClick={(e) => goToHome(e)}>{t('Page.title.home')}</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{t('ViewPage.viewStarship')}</li>
                    </ol>
                </nav>
                <StarshipView starship={starship}/>
            </div>);
        } else if (json.stereotype === "supportingCharacter") {
            let character = marshaller.decodeCharacter(json);
            modifyTitle(character);
            return (<div className="page container ms-0">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/index.html" onClick={(e) => goToHome(e)}>{t('Page.title.home')}</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{t('ViewPage.viewSupportingCharacter')}</li>
                    </ol>
                </nav>
                <SupportingCharacterView character={character} />
            </div>);
        } else if (json.stereotype === "npc") {
            let character = marshaller.decodeCharacter(json);
            modifyTitle(character);
            return (<div className="page container ms-0">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/index.html" onClick={(e) => goToHome(e)}>{t('Page.title.home')}</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{t('ViewPage.viewNpc')}</li>
                    </ol>
                </nav>
                <NpcView character={character} />
            </div>);
        } else if (json.stereotype === "mainCharacter") {
            let character = marshaller.decodeCharacter(json);
            modifyTitle(character);
            return (<div className="page container ms-0">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/index.html" onClick={(e) => goToHome(e)}>{t('Page.title.home')}</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{t('ViewPage.viewMainCharacter')}</li>
                    </ol>
                </nav>
                <MainCharacterView character={character} />
            </div>);
        } else if (json.stereotype === "soloCharacter") {
            let character = marshaller.decodeCharacter(json);
            modifyTitle(character);
            return (<div className="page container ms-0">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/index.html" onClick={(e) => goToHome(e)}>{t('Page.title.home')}</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{t('ViewPage.viewSoloCharacter')}</li>
                    </ol>
                </nav>
                <SoloCharacterView character={character} />
            </div>);
        }
    }

    const goToHome = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        e.stopPropagation();

        navigate("/");
    }

    return (<LcarsFrame activePage={PageIdentity.ViewSheet}>
        <div id="app">
            {renderContents()}
        </div>
    </LcarsFrame>);

}

export default ViewSheetPage;