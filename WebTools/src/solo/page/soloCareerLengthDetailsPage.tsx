import { connect } from "react-redux";
import { Header } from "../../components/header";
import { Navigation } from "../../common/navigator";
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
import SoloCharacterBreadcrumbs from "../component/soloCharacterBreadcrumbs";

const SoloCareerLengthDetailsPage: React.FC<ISoloCharacterProperties> = ({character}) => {
    const { t } = useTranslation();

    const careerLength = CareersHelper.instance.getSoloCareerLength(character.career);

    const navigateToNextStep = () => {
        if (!character.careerValue) {
            Dialog.show(t("SoloCareerLengthDetailsPage.errorValue"));
        } else {
            Navigation.navigateToPage(PageIdentity.SoloCareerEvent1);
        }
    }

    return (
        <div className="page container ml-0">
            <SoloCharacterBreadcrumbs pageIdentity={PageIdentity.SoloCareerLengthDetails} />
            <Header>{careerLength.localizedName}</Header>
                <p>{careerLength.localizedDescription}</p>
                <div className="row">
                    <div className="col-md-6 my-3">
                        <Header level={2} className="mb-3">{t('Construct.other.value')}</Header>

                        <SoloValueInput textDescription={t(makeKey('Value.careerLength.', Career[careerLength.id], '.text'))} onValueChanged={(string) => {store.dispatch(setCharacterValue(string, StepContext.Career))}}/>
                    </div>
                </div>
                <div className='text-right mt-4'>
                    <Button text={t('Common.button.next')} buttonType={true} className="btn btn-primary" onClick={() => navigateToNextStep() }/>
                </div>
        </div>);

}


export default connect(soloCharacterMapStateToProperties)(SoloCareerLengthDetailsPage);