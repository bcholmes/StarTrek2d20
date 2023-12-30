import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ICharacterProperties, characterMapStateToProperties } from "../solo/page/soloCharacterProperties";
import { Environment, EnvironmentsHelper } from "../helpers/environments";
import { setCharacterEnvironment } from "../state/characterActions";
import store from "../state/store";
import { Navigation } from "../common/navigator";
import { PageIdentity } from "./pageIdentity";
import { Stereotype } from "../common/construct";
import { makeKey } from "../common/translationKey";
import { Attribute } from "../helpers/attributes";
import { Window } from "../common/window";
import { Button } from "../components/button";
import { EnvironmentConditionRandomTable, EnvironmentSettingRandomTable } from "../solo/table/environmentRandomTable";
import CharacterCreationBreadcrumbs from "../components/characterCreationBreadcrumbs";
import SoloCharacterBreadcrumbs from "../solo/component/soloCharacterBreadcrumbs";
import { Header } from "../components/header";
import InstructionText from "../components/instructionText";
import { connect } from "react-redux";
import { Skill } from "../helpers/skills";

enum EnvironmentTab {
    Settings,
    Conditions
}

const EnvironmentPage: React.FC<ICharacterProperties> = ({character}) => {

    const { t } = useTranslation();
    const [tab, setTab] = useState((character?.environmentStep == null || EnvironmentsHelper.isSetting(character?.environmentStep?.environment)) ? EnvironmentTab.Settings : EnvironmentTab.Conditions);
    const [randomSetting, setRandomSetting] = useState((character?.environmentStep && EnvironmentsHelper.isSetting(character?.environmentStep?.environment))
        ? character?.environmentStep?.environment
        : null);
    const [randomCondition, setRandomCondition] = useState((character?.environmentStep && EnvironmentsHelper.isCondition(character?.environmentStep?.environment))
        ? character?.environmentStep?.environment
        : null);

    const selectEnvironment = (environment: Environment) => {
        if (environment === Environment.AnotherSpeciesWorld) {
            store.dispatch(setCharacterEnvironment(environment,
                character.environmentStep?.otherSpecies));
        } else {
            store.dispatch(setCharacterEnvironment(environment));
        }

        if (character.stereotype === Stereotype.SoloCharacter) {
            Navigation.navigateToPage(PageIdentity.EnvironmentDetails);
        } else {
            Navigation.navigateToPage(PageIdentity.EnvironmentDetails);
        }
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

        let settingsList = character.stereotype === Stereotype.SoloCharacter
            ? EnvironmentsHelper.getEnvironmentSettings()
            : EnvironmentsHelper.getEnvironmentSettings(character.type);
        if (randomSetting != null) {
            settingsList = [EnvironmentsHelper.getEnvironmentSettingByType(randomSetting)];
        }
        let settingRows = settingsList.map((e,i) => toTableRow(e, i));

        return (<>
            <div className="my-4">
                <Button buttonType={true} className="btn btn-primary btn-sm mr-3" onClick={() => setRandomSetting( EnvironmentSettingRandomTable()) }>
                    <><img src="/static/img/d20.svg" style={{height: "24px", aspectRatio: "1"}} className="mr-1" alt={t('Common.button.random')}/> {t('Common.button.random')}</>
                </Button>
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
                <Button buttonType={true} className="btn btn-primary btn-sm mr-3" onClick={() => setRandomCondition( EnvironmentConditionRandomTable()) }>
                    <><img src="/static/img/d20.svg" style={{height: "24px", aspectRatio: "1"}} className="mr-1" alt={t('Common.button.random')}/> {t('Common.button.random')}</>
                </Button>
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
            {character.stereotype === Stereotype.SoloCharacter
                ? (<SoloCharacterBreadcrumbs pageIdentity={PageIdentity.Environment} />)
                : (<CharacterCreationBreadcrumbs pageIdentity={PageIdentity.Environment} />)};
            <Header>{t('Page.title.environment')}</Header>

            <InstructionText text={t('SoloEnvironmentPage.instruction')} />

            <div className="btn-group w-100" role="group" aria-label="Environment types">
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

export default connect(characterMapStateToProperties)(EnvironmentPage);