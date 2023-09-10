import { useTranslation } from "react-i18next";
import { Navigation } from "../../common/navigator";
import { PageIdentity } from "../../pages/pageIdentity";
import { Header } from "../../components/header";
import InstructionText from "../../components/instructionText";
import { ISoloCharacterProperties, soloCharacterMapStateToProperties } from "./soloCharacterProperties";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Window } from "../../common/window";
import { Button } from "../../components/button";
import { StepContext, addCharacterCareerEvent } from "../../state/characterActions";
import { CareerEventModel, CareerEventsHelper } from "../../helpers/careerEvents";
import { CharacterType } from "../../common/characterType";
import { AttributesHelper } from "../../helpers/attributes";
import { SkillsHelper } from "../../helpers/skills";
import store from "../../state/store";
import SoloCharacterBreadcrumbs from "../component/soloCharacterBreadcrumbs";

interface ISoloCareerEventProperties extends ISoloCharacterProperties {
    context: StepContext;
}

const SoloCareerEventPage: React.FC<ISoloCareerEventProperties> = ({character, context}) => {

    const { t } = useTranslation();
    const careerEvent = context === StepContext.CareerEvent1 ? character.careerEvents[0] : character.careerEvents[1];
    const [randomEvent, setRandomEvent] = useState(careerEvent?.id ?? null);

    const careerEventSelected = (careerEvent: CareerEventModel)=> {
        store.dispatch(addCharacterCareerEvent(careerEvent.roll, context, careerEvent.attributes?.length === 1 ? careerEvent.attributes[0] : undefined,
            careerEvent.disciplines?.length === 1 ? careerEvent.disciplines[0] : undefined));

        Navigation.navigateToPage(context === StepContext.CareerEvent2 ? PageIdentity.SoloCareerEventDetails2 : PageIdentity.SoloCareerEventDetails1);
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
            <SoloCharacterBreadcrumbs pageIdentity={context === StepContext.CareerEvent1 ? PageIdentity.CareerEvent1 : PageIdentity.CareerEvent2} />
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