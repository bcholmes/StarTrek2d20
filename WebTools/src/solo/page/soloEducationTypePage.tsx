import React, { useState } from "react";
import { ICharacterProperties } from "./soloCharacterProperties";
import { useTranslation } from "react-i18next";
import { CharacterType, CharacterTypeModel } from "../../common/characterType";
import store from "../../state/store";
import { Window } from "../../common/window";
import { Button } from "../../components/button";
import { Navigation } from "../../common/navigator";
import { PageIdentity } from "../../pages/pageIdentity";
import { EducationCategoryRandomTable } from "../table/educationRandomTable";
import { connect } from "react-redux";
import { Header } from "../../components/header";
import { setCharacterType } from "../../state/characterActions";
import SoloCharacterBreadcrumbs from "../component/soloCharacterBreadcrumbs";


const SoloEducationTypePage: React.FC<ICharacterProperties> = ({character}) => {

    const { t } = useTranslation();
    const [randomType, setRandomType] = useState(character?.educationStep ? character.type : null);

    const typeSelected = (type: CharacterType)=> {
        store.dispatch(setCharacterType(type));
        Navigation.navigateToPage(PageIdentity.SoloEducationPage);
    }

    const toTableRow = (type: CharacterTypeModel, i: number) => {
        return (
            <tr key={i} onClick={() => { if (Window.isCompact()) typeSelected(type.type); }}>
                <td className="selection-header">{type.localizedName}</td>
                <td className="text-right"><Button buttonType={true} className="button-small" text={t('Common.button.select')} onClick={() => { typeSelected(type.type) }} /></td>
            </tr>
        );
    }

    const types = randomType != null
        ? toTableRow(CharacterTypeModel.getByType(randomType), 0)
        : CharacterTypeModel.getSoloCharacterTypes().map((e, i) => toTableRow(e, i));

    return (
        <div className="page container ml-0">
            <SoloCharacterBreadcrumbs pageIdentity={PageIdentity.SoloEducationType} />
            <Header>{t('Page.title.soloEducationType')}</Header>
            <p className="mt-3">
                {t('SoloEducationTypePage.instruction')}
            </p>
            <div className="my-4">
                <Button buttonType={true} className="btn btn-primary btn-sm mr-3" onClick={() => setRandomType( EducationCategoryRandomTable()) }>
                    <><img src="/static/img/d20.svg" style={{height: "24px", aspectRatio: "1"}} className="mr-1" alt={t('Common.button.random')}/> {t('Common.button.random')}</>
                </Button>
                {randomType != null ? (<Button buttonType={true} className="btn btn-primary btn-sm mr-3" onClick={() => setRandomType(null)} >{t('Common.button.showAll')}</Button>) : undefined}
            </div>
            <table className="selection-list">
                <tbody>
                    {types}
                </tbody>
            </table>

        </div>
    );
}


function mapStateToProps(state, ownProps) {
    return {
        character: state.character?.currentCharacter
    };
}

export default connect(mapStateToProps)(SoloEducationTypePage);