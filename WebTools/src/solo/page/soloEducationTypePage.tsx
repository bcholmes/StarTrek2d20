import React, { useState } from "react";
import { ISoloCharacterProperties } from "./soloCharacterProperties";
import { useTranslation } from "react-i18next";
import { CharacterType, CharacterTypeModel } from "../../common/characterType";
import store from "../../state/store";
import { Window } from "../../common/window";
import { Button } from "../../components/button";
import { navigateTo } from "../../common/navigator";
import { PageIdentity } from "../../pages/pageIdentity";
import { EducationCategoryRandomTable } from "../table/educationRandomTable";
import { connect } from "react-redux";


const SoloEducationTypePage: React.FC<ISoloCharacterProperties> = ({character}) => {

    const { t } = useTranslation();
    const [randomType, setRandomType] = useState(null);

    const typeSelected = (type: CharacterType)=> {
//        store.dispatch(setCharacterType(type));
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
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.Home)}>{t('Page.title.home')}</a></li>
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.SourceSelection)}>{t('Page.title.sourceSelection')}</a></li>
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.SoloConstructType)}>{t('Page.title.soloConstructType')}</a></li>
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.SoloCharacterEra)}>{t('Page.title.era')}</a></li>
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.SoloSpecies)}>{t('Page.title.species')}</a></li>
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.SoloEnvironment)}>{t('Page.title.environment')}</a></li>
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.SoloEarlyOutlook)}>{t('Page.title.soloEarlyOutlook')}</a></li>
                    <li className="breadcrumb-item active" aria-current="page">{t('Page.title.education')}</li>
                </ol>
            </nav>
            <p className="mt-5">
                {t('SoloEducationTypePage.instruction')}
            </p>
            <div className="my-4">
                <Button buttonType={true} className="btn btn-primary btn-sm mr-3" onClick={() => setRandomType( EducationCategoryRandomTable()) }>{t('Common.button.random')}</Button>
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