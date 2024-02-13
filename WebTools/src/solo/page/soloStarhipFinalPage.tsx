import { connect } from "react-redux";
import { Starship } from "../../common/starship";
import { starshipMapStateToProperties } from "./soloCharacterProperties";
import SoloStarshipBreadcrumbs from "../component/soloStarshipBreadcrumbs";
import { Header } from "../../components/header";
import { useTranslation } from "react-i18next";
import { InputFieldAndLabel } from "../../common/inputFieldAndLabel";
import store from "../../state/store";
import { setStarshipName, setStarshipRegistry } from "../../state/starshipActions";
import { useEffect } from "react";
import RegistryNumber from "../../components/registryNumberGenerator";
import { CharacterType } from "../../common/characterType";
import ReactMarkdown from "react-markdown";
import { Button } from "../../components/button";
import { CharacterSheetDialog } from "../../components/characterSheetDialog";
import { CharacterSheetRegistry } from "../../helpers/sheets";

interface ISoloStarshipFinalProperties {
    starship: Starship;
}

const SoloStarshipFinalPage: React.FC<ISoloStarshipFinalProperties> = ({starship}) => {

    const { t } = useTranslation();
    useEffect(() => {
        if (!starship?.registry) {
            store.dispatch(setStarshipRegistry(RegistryNumber.generate(starship.serviceYear, CharacterType.Starfleet, starship.spaceframeModel)))
        }
    } , []);


    const showDialog = () => {
        setTimeout(() => {
            let s = store.getState().starship?.starship;
            CharacterSheetDialog.show(CharacterSheetRegistry.getStarshipSheets(s, store.getState().context?.era), "sta-solo-starship", s);
        }, 200);
    }

    return (<div className="page container ms-0">
        <SoloStarshipBreadcrumbs />
        <Header>{t('Page.title.finalStarshipDetails')}</Header>

        <ReactMarkdown>{t('FinalStarshipDetails.instruction')}</ReactMarkdown>

        <div className="row">

            <div className="col-lg-6 mt-3 mb-4">
                <Header level={2}>{t('Construct.other.name')}</Header>
                <ReactMarkdown>{t('FinalStarshipDetails.name.instruction')}</ReactMarkdown>
                <div className="d-sm-flex align-items-stretch">
                    <InputFieldAndLabel id="name" labelName={t('Construct.other.name')}
                        onChange={(name) => {store.dispatch(setStarshipName(name))}} value={starship?.name ?? ""} />
                </div>

                <div className="d-sm-flex align-items-stretch">
                    <InputFieldAndLabel id="registry" labelName="Registry"
                        onChange={(registry) => {store.dispatch(setStarshipRegistry(registry))}} value={starship?.registry ?? ""} />
                </div>

            </div>

            <div className="button-container mb-5">
                    <Button className="button-small me-2" onClick={() => showDialog() }  buttonType={true}>{t('Common.button.exportPdf')}</Button>
                </div>

        </div>
    </div>);
}

export default connect(starshipMapStateToProperties)(SoloStarshipFinalPage);