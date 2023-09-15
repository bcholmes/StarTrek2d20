import { useState } from "react";
import {CareerEventStep, character} from '../common/character';
import {Navigation} from '../common/navigator';
import {PageIdentity} from './pageIdentity';
import {CareerEventModel, CareerEventsHelper} from '../helpers/careerEvents';
import {Button} from '../components/button';
import InstructionText from '../components/instructionText';
import CharacterCreationBreadcrumbs from '../components/characterCreationBreadcrumbs';
import { AttributesHelper } from '../helpers/attributes';
import { SkillsHelper } from '../helpers/skills';
import { Window } from '../common/window';
import { useTranslation } from 'react-i18next';
import { Header } from '../components/header';

export const CareerEventPage = () => {
    const c = character;
    const { t } = useTranslation();
    const [randomEvent, setRandomEvent] = useState(null);

    const careerEventSelected = (careerEvent: CareerEventModel)=> {
        c.careerEvents.push(new CareerEventStep(careerEvent.roll));
        CareerEventsHelper.applyCareerEvent(careerEvent.roll, c.type);

        if (c.careerEvents.length === 1) {
            Navigation.navigateToPage(PageIdentity.CareerEvent1Details);
        } else {
            Navigation.navigateToPage(PageIdentity.CareerEvent2Details);
        }

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
        ? toTableRow(CareerEventsHelper.getCareerEvent(randomEvent, c.type) , 0)
        : CareerEventsHelper.getCareerEvents(c.type).map((c, i) => toTableRow(c, i));

    return (
        <div className="page container ml-0">
            <CharacterCreationBreadcrumbs />
            <Header>{t('Page.title.careerEvent')}</Header>
            <InstructionText text={character.workflow.currentStep().description} />
            <div className="my-4">
                <Button buttonType={true} className="btn btn-primary btn-sm mr-3" onClick={() => setRandomEvent( CareerEventsHelper.generateEvent(c.type).roll) }>
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
