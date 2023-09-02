import { connect } from "react-redux";
import { Header } from "../../components/header";
import { Navigation, navigateTo } from "../../common/navigator";
import { PageIdentity } from "../../pages/pageIdentity";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/button";
import React, { useState } from "react";
import { makeKey } from "../../common/translationKey";
import { AttributesHelper } from "../../helpers/attributes";
import { Skill } from "../../helpers/skills";
import { Window } from "../../common/window";
import InstructionText from "../../components/instructionText";
import { EarlyOutlook, EarlyOutlookModel, UpbringingsHelper } from "../../helpers/upbringings";
import { EarlyOutlookAspirationRandomTable, EarlyOutlookCasteRandomTable, EarlyOutlookUpbringingRandomTable } from "../table/earlyOutlookRandomTable";
import { setCharacterEarlyOutlook } from "../../state/characterActions";
import store from "../../state/store";
import { ISoloCharacterProperties } from "./soloCharacterProperties";

enum EarlyOutlookTab {
    Upbringings,
    Castes,
    Aspirations
}

const SoloEarlyOutlookPage: React.FC<ISoloCharacterProperties> = ({character}) => {

    const { t } = useTranslation();
    const [tab, setTab] = useState(EarlyOutlookTab.Upbringings);
    const [randomUpbringing, setRandomUpbringing] = useState(null);
    const [randomAsperation, setRandomAsperation] = useState(null);
    const [randomCaste, setRandomCaste] = useState(null);

    const selectOutlook = (outlook: EarlyOutlookModel) => {
        store.dispatch(setCharacterEarlyOutlook(outlook));
        Navigation.navigateToPage(PageIdentity.SoloEarlyOutlookDetails);

    }

    const renderTab = () => {
        switch (tab) {
            case EarlyOutlookTab.Upbringings:
                return renderUpbringingsTab();
            case EarlyOutlookTab.Aspirations:
                return renderAspirationsTab();
            case EarlyOutlookTab.Castes:
            default:
                return renderCastessTab();
        }
    }


    const toTableRow = (u, i) => {
        const disciplines = u.disciplines.map((d, i) => {
            return <div key={i}>{t(makeKey('Construct.discipline.', Skill[d]))}</div>;
        });

        if (Window.isCompact()) {
            return (
                <tr key={i} onClick={() => { selectOutlook(u) } }>
                    <td className="selection-header">{u.name}</td>
                    <td>
                        ACCEPT<br/>
                        <div>{AttributesHelper.getAttributeName(u.attributeAcceptPlus2) } +2</div>
                        <div>{AttributesHelper.getAttributeName(u.attributeAcceptPlus1) } +1</div>
                        <br/>
                        REBEL<br/>
                        <div>{AttributesHelper.getAttributeName(u.attributeRebelPlus2) } +2</div>
                        <div>{AttributesHelper.getAttributeName(u.attributeRebelPlus1) } +1</div>
                    </td>
                    <td>{disciplines}</td>
                </tr>
            )
        }
        else {
            return (
                <tr key={i}>
                    <td className="selection-header">{u.name}</td>
                    <td>
                        <div>{AttributesHelper.getAttributeName(u.attributeAcceptPlus2) } +2</div>
                        <div>{AttributesHelper.getAttributeName(u.attributeAcceptPlus1) } +1</div>
                    </td>
                    <td>
                        <div>{AttributesHelper.getAttributeName(u.attributeRebelPlus2) } +2</div>
                        <div>{AttributesHelper.getAttributeName(u.attributeRebelPlus1) } +1</div>
                    </td>
                    <td>{disciplines}</td>
                    <td className="text-right"><Button className="button-small" text="Select" onClick={() => { selectOutlook(u) } } buttonType={true} /></td>
                </tr>
            )
        }
    }

    const renderUpbringingsTab = () => {

        let settingsList = UpbringingsHelper.getUpbringings();
        if (randomUpbringing != null) {
            settingsList = [UpbringingsHelper.getUpbringing(randomUpbringing)];
        }
        let settingRows = settingsList.map((e,i) => toTableRow(e, i));

        return (<>
            <div className="my-4">
                <Button buttonType={true} className="btn btn-primary btn-sm mr-3" onClick={() => setRandomUpbringing( EarlyOutlookUpbringingRandomTable()) }>{t('Common.button.random')}</Button>
                {randomUpbringing != null ? (<Button buttonType={true} className="btn btn-primary btn-sm mr-3" onClick={() => setRandomUpbringing(null)} >{t('Common.button.showAll')}</Button>) : undefined}
            </div>

            <table className="selection-list">
                    <thead>
                        <tr>
                            <td></td>
                            <td><b>{t('Construct.other.attributes')}</b></td>
                            <td><b>{t('Construct.other.disciplines')}</b></td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {settingRows}
                    </tbody>
                </table>
            </>);
    }

    const renderCastessTab = () => {

        let settingsList = UpbringingsHelper.getCastes();
        if (randomCaste != null) {
            settingsList = [UpbringingsHelper.getCaste(randomCaste)];
        }
        let settingRows = settingsList.map((e,i) => toTableRow(e, i));

        return (<>
            <div className="my-4">
                <Button buttonType={true} className="btn btn-primary btn-sm mr-3" onClick={() => setRandomCaste( EarlyOutlookCasteRandomTable()) }>{t('Common.button.random')}</Button>
                {randomCaste != null ? (<Button buttonType={true} className="btn btn-primary btn-sm mr-3" onClick={() => setRandomCaste(null)} >{t('Common.button.showAll')}</Button>) : undefined}
            </div>

            <table className="selection-list">
                    <thead>
                        <tr>
                            <td></td>
                            <td><b>{t('Construct.other.attributes')}</b></td>
                            <td><b>{t('Construct.other.disciplines')}</b></td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {settingRows}
                    </tbody>
                </table>
            </>);
    }

    const renderAspirationsTab = () => {

        let settingsList = UpbringingsHelper.getAspirations();
        if (randomAsperation != null) {
            settingsList = [UpbringingsHelper.getAspiration(randomAsperation)];
        }
        let settingRows = settingsList.map((e,i) => toTableRow(e, i));

        return (<>
            <div className="my-4">
                <Button buttonType={true} className="btn btn-primary btn-sm mr-3" onClick={() => setRandomAsperation( EarlyOutlookAspirationRandomTable()) }>{t('Common.button.random')}</Button>
                {randomAsperation != null ? (<Button buttonType={true} className="btn btn-primary btn-sm mr-3" onClick={() => setRandomAsperation(null)} >{t('Common.button.showAll')}</Button>) : undefined}
            </div>

            <table className="selection-list">
                    <thead>
                        <tr>
                            <td></td>
                            <td><b>{t('Construct.other.attributes')}</b></td>
                            <td><b>{t('Construct.other.disciplines')}</b></td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {settingRows}
                    </tbody>
                </table>
            </>);
    }

    return (
        <div className="page container ml-0">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.Home)}>{t('Page.title.home')}</a></li>
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.SourceSelection)}>{t('Page.title.sourceSelection')}</a></li>
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.SoloConstructType)}>{t('Page.title.soloConstructType')}</a></li>
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.SoloCharacterEra)}>{t('Page.title.era')}</a></li>
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.SoloSpecies)}>{t('Page.title.species')}</a></li>
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.SoloEnvironment)}>{t('Page.title.environment')}</a></li>
                    <li className="breadcrumb-item active" aria-current="page">{t('Page.title.soloEarlyOutlook')}</li>
                </ol>
            </nav>
            <Header>{t('Page.title.soloEarlyOutlook')}</Header>

            <InstructionText text={t('SoloEarlyOutlookPage.instruction')} />

            <div className="btn-group w-100" role="group" aria-label="Early Outlook Types">
                <button type="button" className={'btn btn-info btn-sm p-2 text-center ' + (tab === EarlyOutlookTab.Upbringings ? "active" : "")}
                    onClick={() => setTab(EarlyOutlookTab.Upbringings)}>{t('SoloEarlyOutlookPage.upbringings')}</button>
                <button type="button" className={'btn btn-info btn-sm p-2 text-center ' + (tab === EarlyOutlookTab.Castes ? "active" : "")}
                    onClick={() => setTab(EarlyOutlookTab.Castes)}>{t('SoloEarlyOutlookPage.castes')}</button>
                <button type="button" className={'btn btn-info btn-sm p-2 text-center ' + (tab === EarlyOutlookTab.Aspirations ? "active" : "")}
                    onClick={() => setTab(EarlyOutlookTab.Aspirations)}>{t('SoloEarlyOutlookPage.aspirations')}</button>
            </div>

            {renderTab()}
        </div>);
}


function mapStateToProps(state, ownProps) {
    return {
        character: state.character?.currentCharacter
    };
}

export default connect(mapStateToProps)(SoloEarlyOutlookPage);