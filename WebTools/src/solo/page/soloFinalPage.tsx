import { useTranslation } from "react-i18next";
import { ISoloCharacterProperties, soloCharacterMapStateToProperties } from "./soloCharacterProperties";
import { PageIdentity } from "../../pages/pageIdentity";
import { Header } from "../../components/header";
import { connect } from "react-redux";
import store from "../../state/store";
import { setCharacterName, setCharacterPronouns } from "../../state/characterActions";
import { InputFieldAndLabel } from "../../common/inputFieldAndLabel";
import { Button } from "../../components/button";
import { CharacterSheetDialog } from "../../components/characterSheetDialog";
import { CharacterSheetRegistry } from "../../helpers/sheets";
import SoloCharacterBreadcrumbs from "../component/soloCharacterBreadcrumbs";

const SoloFinalPage: React.FC<ISoloCharacterProperties> = ({character}) => {
    const { t } = useTranslation();

    const showDialog = () => {
        setTimeout(() => {
            let c = store.getState().character.currentCharacter;
            CharacterSheetDialog.show(CharacterSheetRegistry.getCharacterSheets(c), "sta-solo-character", c);
        }, 200);
    }

    const showViewPage = () => {
    }

    return (
        <div className="page container ml-0">
            <SoloCharacterBreadcrumbs pageIdentity={PageIdentity.SoloFinalPage} />

            <Header>{t('Page.title.soloFinish')}</Header>

            <div className="row">
                <div className="col-md-6 my-3">
                    <Header level={2} className="mb-3">{t('Construct.other.name')}</Header>

                    <InputFieldAndLabel id="name" labelName={t('Construct.other.name')}
                        value={character.name || ""}
                        onChange={(v) => store.dispatch(setCharacterName(v))} />

                    <InputFieldAndLabel id="pronouns" labelName={t('Construct.other.pronouns')}
                        value={character.pronouns || ""}
                        onChange={(v) => store.dispatch(setCharacterPronouns(v))} />

                </div>

                <div className="col-md-6 my-3">
                    <Header level={2} className="mb-3">{t('Construct.other.assignment')}</Header>
                </div>

                <div className="col-md-6 my-3">
                    <Header level={2} className="mb-3">{t('Construct.other.rank')}</Header>
                </div>
            </div>
            <div className="button-container mb-5">
                <Button buttonType={true} text={t('Common.button.exportPdf')} className="btn btn-primary btn-sm mr-3" onClick={() => showDialog() }  />
                <Button buttonType={true} text={t('Common.button.view')} className="btn btn-primary btn-sm mr-3" onClick={() => showViewPage() } />
            </div>

        </div>);

}


export default connect(soloCharacterMapStateToProperties)(SoloFinalPage);