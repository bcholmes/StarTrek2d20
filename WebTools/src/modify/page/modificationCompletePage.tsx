import React from "react";
import { connect } from "react-redux";
import { useTranslation } from 'react-i18next';
import { Character } from "../../common/character";
import { Header } from "../../components/header";
import { Button } from "../../components/button";
import { navigateTo } from "../../common/navigator";
import { PageIdentity } from "../../pages/pageIdentity";
import { marshaller } from "../../helpers/marshaller";
import InstructionText from "../../components/instructionText";
import { ModifyBreadcrumb } from "../modifyBreadcrumb";

interface ModificationCompletePageProperties {
    character?: Character;
}

const ModificationCompletePage: React.FC<ModificationCompletePageProperties> = ({character}) => {
    const { t } = useTranslation();

    const showViewPage = () => {
        const value = marshaller.encodeMainCharacter(character);
        window.open('/view?s=' + value, "_blank");
    }

    return (<div className="page container ms-0">
        <ModifyBreadcrumb isComplete />

        <Header>{t('Page.title.modificationComplete')}</Header>
        <InstructionText text={t('ModificationCompletePage.instruction')} />

        <div className="my-4 text-end">
            <Button className="btn btn-primary btn-sm me-2" onClick={() => navigateTo(null, PageIdentity.ModificationTypeSelection)}>Modify</Button>
            <Button className="btn btn-primary btn-sm" onClick={() => showViewPage()}>View</Button>
        </div>
    </div>);

}

function mapStateToProps(state, ownProps) {
    return {
        character: state.character.currentCharacter
    };
}

export default connect(mapStateToProps)(ModificationCompletePage);