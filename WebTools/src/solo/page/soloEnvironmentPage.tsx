import { connect } from "react-redux";
import { Header } from "../../components/header";
import { Navigation, navigateTo } from "../../common/navigator";
import { PageIdentity } from "../../pages/pageIdentity";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/button";
import { useState } from "react";
import { EnvironmentConditionRandomTable, EnvironmentSettingRandomTable } from "../table/environmentRandomTable";
import { Environment, EnvironmentsHelper } from "../../helpers/environments";
import { makeKey } from "../../common/translationKey";
import { Attribute } from "../../helpers/attributes";
import { Skill } from "../../helpers/skills";
import { Window } from "../../common/window";
import InstructionText from "../../components/instructionText";
import store from "../../state/store";
import { setCharacterEnvironment } from "../../state/characterActions";

enum EnvironmentTab {
    Settings,
    Conditions
}

const SoloEnvironmentPage = ({character}) => {

    const { t } = useTranslation();
    const [tab, setTab] = useState(EnvironmentTab.Settings);
    const [randomSetting, setRandomSetting] = useState(null);
    const [randomCondition, setRandomCondition] = useState(null);

    const selectEnvironment = (environment: Environment) => {
        store.dispatch(setCharacterEnvironment(environment));
        Navigation.navigateToPage(PageIdentity.SoloEnvironmentDetails);
    }

    const toTableRow = (e, i) => {
        let attributes = e.getAttributesForCharacter(character).map((a, i) => {
            return <div key={'attr-' + i}>{t(makeKey('Construct.attribute.', Attribute[a])) }</div>;
        });

        if (e.id === Environment.AnotherSpeciesWorld) {
            attributes = (<div key={'attr-' + i}>{t('SoloEnvironmentPage.anotherSpeciesWorld.attributeText')}</div>)
        }

        const disciplines = e.disciplines.map((d, i) => {
            return <div key={'skill-' + i}>{t(makeKey('Construct.discipline.', Skill[d]))}</div>;
        });

        return (
            <tr key={i}
                onClick={() => { if (Window.isCompact()) selectEnvironment(e.id); }}>
                <td className="selection-header">{e.localizedName}</td>
                <td>{attributes}</td>
                <td>{disciplines}</td>
                <td className="text-right">
                    <Button className="button-small" onClick={() => { selectEnvironment(e.id) } } buttonType={true} >{t('Common.button.select')}</Button>
                </td>
            </tr>
        )
    }

    const renderSettingsTab = () => {

        let settingsList = EnvironmentsHelper.getEnvironmentSettings();
        if (randomSetting != null) {
            settingsList = [EnvironmentsHelper.getEnvironmentSettingByType(randomSetting)];
        }
        let settingRows = settingsList.map((e,i) => toTableRow(e, i));

        return (<>
            <div className="my-4">
                <Button buttonType={true} className="btn btn-primary btn-sm mr-3" onClick={() => setRandomSetting( EnvironmentSettingRandomTable()) }>{t('Common.button.random')}</Button>
                {randomSetting != null ? (<Button buttonType={true} className="btn btn-primary btn-sm mr-3" onClick={() => setRandomSetting(null)} >{t('Common.button.showAll')}</Button>) : undefined}
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

    const renderConditionsTab = () => {

        let settingsList = EnvironmentsHelper.getEnvironmentConditions();
        if (randomCondition != null) {
            settingsList = [EnvironmentsHelper.getEnvironmentConditionByType(randomCondition)];
        }
        let settingRows = settingsList.map((e,i) => toTableRow(e, i));

        return (<>
            <div className="my-4">
                <Button buttonType={true} className="btn btn-primary btn-sm mr-3" onClick={() => setRandomCondition( EnvironmentConditionRandomTable()) }>{t('Common.button.random')}</Button>
                {randomCondition != null ? (<Button buttonType={true} className="btn btn-primary btn-sm mr-3" onClick={() => setRandomCondition(null)} >{t('Common.button.showAll')}</Button>) : undefined}
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
                    <li className="breadcrumb-item active" aria-current="page">{t('Page.title.environment')}</li>
                </ol>
            </nav>
            <Header>{t('Page.title.environment')}</Header>;

            <InstructionText text={t('SoloEnvironmentPage.instruction')} />

            <div className="btn-group w-100" role="group" aria-label="Avatar part types">
                <button type="button" className={'btn btn-info btn-sm p-2 text-center ' + (tab === EnvironmentTab.Settings ? "active" : "")}
                    onClick={() => setTab(EnvironmentTab.Settings)}>{t('SoloEnvironmentPage.settings')}</button>
                <button type="button" className={'btn btn-info btn-sm p-2 text-center ' + (tab === EnvironmentTab.Conditions ? "active" : "")}
                    onClick={() => setTab(EnvironmentTab.Conditions)}>{t('SoloEnvironmentPage.conditions')}</button>
            </div>

            {tab === EnvironmentTab.Settings
                ? renderSettingsTab()
                : renderConditionsTab()}
        </div>);
}


function mapStateToProps(state, ownProps) {
    return {
        character: state.character?.currentCharacter
    };
}

export default connect(mapStateToProps)(SoloEnvironmentPage);