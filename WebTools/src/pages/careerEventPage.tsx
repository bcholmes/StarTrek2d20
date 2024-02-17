import { useState } from "react";
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
import { StepContext, addCharacterCareerEvent } from "../state/characterActions";
import { hasSource } from "../state/contextFunctions";
import { Source } from "../helpers/sources";
import ReactMarkdown from "react-markdown";
import store from "../state/store";
import { ICharacterProperties, characterMapStateToProperties } from "../solo/page/soloCharacterProperties";
import { connect } from "react-redux";

enum EventsTab {
    Standard,
    StandardAndUnofficial
}

interface ICareerEventProperties extends ICharacterProperties {
    context: StepContext;
}

const CareerEventPage: React.FC<ICareerEventProperties> = ({character, context}) => {
    const { t } = useTranslation();
    const [randomEvent, setRandomEvent] = useState(null);
    const [randomEventWithUnofficial, setRandomEventWithUnofficial] = useState(null);
    const [tab, setTab] = useState(EventsTab.Standard);

    const careerEventSelected = (careerEvent: CareerEventModel)=> {
        store.dispatch(addCharacterCareerEvent(careerEvent.roll, context, careerEvent.attributes?.length === 1 ? careerEvent.attributes[0] : undefined,
            careerEvent.disciplines?.length === 1 ? careerEvent.disciplines[0] : undefined));

        Navigation.navigateToPage(context === StepContext.CareerEvent2 ? PageIdentity.CareerEvent2Details : PageIdentity.CareerEvent1Details);
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
                <td className="text-end"><Button className="button-small" onClick={() => { careerEventSelected(careerEvent) } } buttonType={true}>{t('Common.button.select')}</Button></td>
            </tr>
        )
    }

    const generateRandomEvent = (includeUnofficial: boolean) => {
        if (includeUnofficial) {
            return Math.floor(Math.random() * 50) + 1;
        } else {
            return CareerEventsHelper.generateEvent(character.type).roll;
        }
    }

    const renderStandardTab = () => {

        const events = randomEvent != null
            ? toTableRow(CareerEventsHelper.getCareerEvent(randomEvent, character.type) , 0)
            : CareerEventsHelper.getCareerEvents(character.type).map((c, i) => toTableRow(c, i));

        return (<>
            <div className="my-4">
                <Button buttonType={true} className="btn btn-primary btn-sm me-3" onClick={() => setRandomEvent( generateRandomEvent(false)) }>
                    <><img src="/static/img/d20.svg" style={{height: "24px", aspectRatio: "1"}} className="me-1" alt={t('Common.button.random')}/> {t('Common.button.random')}</>
                </Button>
                {randomEvent != null ? (<Button buttonType={true} className="btn btn-primary btn-sm me-3" onClick={() => setRandomEvent(null)} >{t('Common.button.showAll')}</Button>) : undefined}
            </div>

            <table className="selection-list">
                <tbody>
                    {events}
                </tbody>
            </table>
        </>);
    }

    const renderStandardAndUnofficialTab = () => {

        const events = randomEventWithUnofficial != null
            ? toTableRow(CareerEventsHelper.getCareerEvent(randomEventWithUnofficial, character.type) , 0)
            : CareerEventsHelper.getCareerEventsIncludingUnofficial(character.type).map((c, i) => toTableRow(c, i));

        return (<>
            <div className="mt-4">
                <ReactMarkdown children={t('CareerEvents.unofficialNote')} linkTarget="_blank" />
            </div>
            <div className="my-4">
                <Button buttonType={true} className="btn btn-primary btn-sm me-3" onClick={() => setRandomEventWithUnofficial( generateRandomEvent(true)) }>
                    <><img src="/static/img/d20.svg" style={{height: "24px", aspectRatio: "1"}} className="me-1" alt={t('Common.button.random')}/> {t('Common.button.random')}</>
                </Button>
                {randomEventWithUnofficial != null ? (<Button buttonType={true} className="btn btn-primary btn-sm me-3" onClick={() => setRandomEventWithUnofficial(null)} >{t('Common.button.showAll')}</Button>) : undefined}
            </div>

            <table className="selection-list">
                <tbody>
                    {events}
                </tbody>
            </table>
        </>);
    }

    return (
        <div className="page container ms-0">
            <CharacterCreationBreadcrumbs />
            <Header>{t('Page.title.careerEvent')}</Header>
            <InstructionText text={t('CareerEvents.instruction')} />
            {hasSource(Source.ContinuingMissions)
                ? (<div className="btn-group w-100" role="group" aria-label="Environment types">
                    <button type="button" className={'btn btn-info btn-sm p-2 text-center ' + (tab === EventsTab.Standard ? "active" : "")}
                        onClick={() => setTab(EventsTab.Standard)}>{t('CareerEvents.standard')}</button>
                    <button type="button" className={'btn btn-info btn-sm p-2 text-center ' + (tab === EventsTab.StandardAndUnofficial ? "active" : "")}
                        onClick={() => setTab(EventsTab.StandardAndUnofficial)}>{t('CareerEvents.standardAndUnofficial')}</button>
                </div>)
                : undefined}

            {tab === EventsTab.Standard
                ? renderStandardTab()
                : renderStandardAndUnofficialTab()}

        </div>);
}

export default connect(characterMapStateToProperties)(CareerEventPage);