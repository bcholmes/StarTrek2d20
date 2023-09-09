import { connect } from "react-redux";
import { Header } from "../../components/header";
import { Navigation, navigateTo } from "../../common/navigator";
import { PageIdentity } from "../../pages/pageIdentity";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/button";
import store from "../../state/store";
import { StepContext, setCharacterValue } from "../../state/characterActions";
import SoloValueInput from "../component/soloValueInput";
import { ISoloCharacterProperties, soloCharacterMapStateToProperties } from "./soloCharacterProperties";
import { CareersHelper } from "../../helpers/careers";
import { Dialog } from "../../components/dialog";
import { makeKey } from "../../common/translationKey";
import { Career } from "../../helpers/careerEnum";
import { CareerEventsHelper } from "../../helpers/careerEvents";
import { CharacterType } from "../../common/characterType";
import InstructionText from "../../components/instructionText";

interface ISoloCareerEventProperties extends ISoloCharacterProperties {
    context: StepContext;
}

const SoloCareerEventDetailsPage: React.FC<ISoloCareerEventProperties> = ({character, context}) => {
    const { t } = useTranslation();

    const careerEvent =
        context === StepContext.CareerEvent1
            ? CareerEventsHelper.getCareerEvent(character.careerEvents[0]?.id, CharacterType.Starfleet)
            : CareerEventsHelper.getCareerEvent(character.careerEvents[1]?.id, CharacterType.Starfleet);

    const navigateToNextStep = () => {
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
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.SoloCareerLength)}>{t('Page.title.soloCareerLength')}</a></li>
                    <li className="breadcrumb-item active" aria-current="page">{t('Page.title.soloCareerEventPage')}</li>
                </ol>
            </nav>

            <Header>{careerEvent.name}</Header>
                <InstructionText text={careerEvent.description} />
                <div className="row">
                    <div className="col-md-6 my-3">
                        <Header level={2} className="mb-3">{t('Construct.other.attribute')}</Header>
                    </div>
                    <div className="col-md-6 my-3">
                        <Header level={2} className="mb-3">{t('Construct.other.discipline')}</Header>
                    </div>
                    <div className="col-md-6 my-3">
                        <Header level={2} className="mb-3">{t('Construct.other.focus')}</Header>
                    </div>
                </div>
                <div className='text-right mt-4'>
                    <Button text={t('Common.button.next')} buttonType={true} className="btn btn-primary" onClick={() => navigateToNextStep() }/>
                </div>
        </div>);

}


export default connect(soloCharacterMapStateToProperties)(SoloCareerEventDetailsPage);