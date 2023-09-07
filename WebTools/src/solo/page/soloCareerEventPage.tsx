import { useTranslation } from "react-i18next";
import { navigateTo } from "../../common/navigator";
import { PageIdentity } from "../../pages/pageIdentity";
import { Header } from "../../components/header";
import InstructionText from "../../components/instructionText";
import { ISoloCharacterProperties, soloCharacterMapStateToProperties } from "./soloCharacterProperties";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Window } from "../../common/window";
import { Button } from "../../components/button";
import { StepContext } from "../../state/characterActions";
import { CareerEventModel, CareerEventsHelper } from "../../helpers/careerEvents";
import { CharacterType } from "../../common/characterType";
import { AttributesHelper } from "../../helpers/attributes";
import { SkillsHelper } from "../../helpers/skills";

interface ISoloCareerEventProperties extends ISoloCharacterProperties {
    context: StepContext;
}

const SoloCareerEventPage: React.FC<ISoloCareerEventProperties> = ({character, context}) => {

    const { t } = useTranslation();
    const [randomEvent, setRandomEvent] = useState(null);

    const careerEventSelected = (careerEvent: CareerEventModel)=> {
    }

    const toTableRow = (careerEvent: CareerEventModel, i: number) => {
        const attributes = careerEvent.attributes.map((a, i) => {
            return <div key={i}>{AttributesHelper.getAttributeName(a) }</div>
        });

        const disciplines = careerEvent.disciplines.map((d, i) => {
            return <div key={i}>{SkillsHelper.getSkillName(d) }</div>;
        });

        return (
            <tr key={i}
                onClick={() => { if (Window.isCompact()) careerEventSelected(careerEvent); } }>
                <td className="selection-header">{careerEvent.name}</td>
                <td>{attributes}</td>
                <td>{disciplines}</td>
                <td className="text-right"><Button className="button-small" text="Select" onClick={() => { careerEventSelected(careerEvent) } } buttonType={true}/></td>
            </tr>
        )
    }

    const events = randomEvent != null
        ? toTableRow(CareerEventsHelper.getCareerEvent(randomEvent, CharacterType.Starfleet) , 0)
        : CareerEventsHelper.getSoloCareerEvents().map((c, i) => toTableRow(c, i));



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
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.SoloEarlyOutlook)}>{t('Page.title.soloEarlyOutlook')}</a></li>
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.SoloEarlyOutlook)}>{t('Page.title.soloEducation')}</a></li>
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.SoloCareerLength)}>{t('Page.title.soloCareerLength')}</a></li>
                    <li className="breadcrumb-item active" aria-current="page">{t('Page.title.soloCareerEventPage')}</li>
                </ol>
            </nav>
            <Header>{t('Page.title.soloCareerEvent')}</Header>
            <InstructionText text={t('SoloCareerEvent.instruction')} />
            <div className="my-4">
                <Button buttonType={true} className="btn btn-primary btn-sm mr-3" onClick={() => setRandomEvent( CareerEventsHelper.generateEvent(CharacterType.Starfleet).roll) }>
                    <img src="/static/img/d20.svg" style={{height: "24px", aspectRatio: "1"}} className="mr-1" alt={t('Common.button.random')}/> {t('Common.button.random')}
                </Button>
                {randomEvent != null ? (<Button buttonType={true} className="btn btn-primary btn-sm mr-3" onClick={() => setRandomEvent(null)} >{t('Common.button.showAll')}</Button>) : undefined}
            </div>
            <table className="selection-list">
                <tbody>
                    {events}
                </tbody>
            </table>
        </div>);
}

export default connect(soloCharacterMapStateToProperties)(SoloCareerEventPage);