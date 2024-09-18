import { connect } from "react-redux";
import { ICharacterPageProperties } from "../../common/iCharacterPageProperties";
import { characterMapStateToProperties } from "../../solo/page/soloCharacterProperties";
import LcarsFrame from "../../components/lcarsFrame";
import { PageIdentity } from "../../pages/pageIdentity";
import { useTranslation } from "react-i18next";
import { Header } from "../../components/header";
import Markdown from "react-markdown";

const ModifySupportingCharacterPage : React.FC<ICharacterPageProperties> = ({character}) => {

    const { t } = useTranslation();

    return (<LcarsFrame activePage={PageIdentity.ModifySupportingCharacter}>
        <div id="app">
            <div className="page container ms-0">
                <Header>{t("Page.title.modifySupportingCharacter")}</Header>
                <Markdown className="mt-4">{t('ModifySupportingCharacter.instruction')}</Markdown>
            </div>
        </div>
    </LcarsFrame>);
}

export default connect(characterMapStateToProperties)(ModifySupportingCharacterPage);