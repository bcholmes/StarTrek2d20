import { connect } from "react-redux";
import { Header } from "../../components/header";
import { navigateTo } from "../../common/navigator";
import { PageIdentity } from "../../pages/pageIdentity";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/button";
import store from "../../state/store";
import { StepContext, setCharacterValue } from "../../state/characterActions";
import SoloValueInput from "../component/soloValueInput";
import { ISoloCharacterProperties, soloCharacterMapStateToProperties } from "./soloCharacterProperties";
import { CareersHelper } from "../../helpers/careers";

const SoloCareerLengthDetailsPage: React.FC<ISoloCharacterProperties> = ({character}) => {
    const { t } = useTranslation();

    const careerLength = CareersHelper.instance.getSoloCareerLength(character.career);

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
                    <li className="breadcrumb-item active" aria-current="page">{t('Page.title.environment')}</li>
                </ol>
            </nav>

            <Header>{careerLength.localizedName}</Header>
                <p>{careerLength.localizedDescription}</p>
                <div className="row">
                    <div className="col-md-6 my-3">
                        <Header level={2} className="mb-3">{t('Construct.other.value')}</Header>

                        <SoloValueInput textDescription={careerLength.localizedValueDescription} onValueChanged={(string) => {store.dispatch(setCharacterValue(string, StepContext.Career))}}/>
                    </div>
                </div>
                <div className='text-right mt-4'>
                    <Button text={t('Common.button.next')} buttonType={true} className="btn btn-primary" onClick={() => navigateToNextStep() }/>
                </div>
        </div>);

}


export default connect(soloCharacterMapStateToProperties)(SoloCareerLengthDetailsPage);