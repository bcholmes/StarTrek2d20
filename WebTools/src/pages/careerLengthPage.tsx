import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import { connect } from "react-redux";
import { ICharacterProperties, characterMapStateToProperties } from "../solo/page/soloCharacterProperties";
import { CareerModel, CareersHelper } from "../helpers/careers";
import { setCharacterCareerLength } from "../state/characterActions";
import store from "../state/store";
import { Navigation } from "../common/navigator";
import { PageIdentity } from "./pageIdentity";
import { Button } from "../components/button";
import { Window } from "../common/window";
import SoloCharacterBreadcrumbs from "../solo/component/soloCharacterBreadcrumbs";
import { Header } from "../components/header";
import InstructionText from "../components/instructionText";
import { CareerLengthRandomTable } from "../solo/table/careerLengthRandomTable";
import { Stereotype } from "../common/construct";
import CharacterCreationBreadcrumbs from "../components/characterCreationBreadcrumbs";
import { CharacterType } from "../common/characterType";
import { ADVANCED_TEAM_DYNAMICS } from "../helpers/talents";
import { Career } from "../helpers/careerEnum";
import { D20 } from "../common/die";

const CareerLengthPage: React.FC<ICharacterProperties> = ({character}) => {

    const { t } = useTranslation();
    const [randomLength, setRandomLength] = useState(character?.careerStep?.career);

    const careerLengthSelected = (careerLength: CareerModel)=> {
        store.dispatch(setCharacterCareerLength(careerLength.id));
        if (character.stereotype === Stereotype.SoloCharacter) {
            Navigation.navigateToPage(PageIdentity.SoloCareerLengthDetails);
        } else {
            Navigation.navigateToPage(PageIdentity.CareerLengthDetails);
        }
    }

    const toTableRow = (careerLength: CareerModel, i: number) => {
        return (
            <tr key={i} onClick={() => { if (Window.isCompact()) careerLengthSelected(careerLength); }}>
                <td className="selection-header">{careerLength.localizedName}</td>
                <td className="text-end"><Button className="btn btn-primary btn-sm"
                    onClick={() => { careerLengthSelected(careerLength) }}
                >{t('Common.button.select')}</Button></td>
            </tr>
        );
    }

    const selectRandomCareerLength = () => {
        if (character.hasTalent(ADVANCED_TEAM_DYNAMICS)) {
            return D20.roll() <= 10 ? Career.Experienced : Career.Veteran;
        } else {
            return CareerLengthRandomTable();
        }
    }

    const lengths = character.stereotype === Stereotype.SoloCharacter
        ? (randomLength != null
            ? toTableRow(CareersHelper.instance.getSoloCareerLength(randomLength), 0)
            : CareersHelper.instance.getSoloCareerLengths().map((c, i) => toTableRow(c, i)))
        : (randomLength != null
            ? toTableRow(CareersHelper.instance.getCareer(randomLength, character), 0)
            : CareersHelper.instance.getCareers(character)
                .filter(c => !character.hasTalent(ADVANCED_TEAM_DYNAMICS) || c.id !== Career.Young )
                .map((c, i) => toTableRow(c, i)));

    let instructionKey = "CareerLength.instruction";
    if (character.type === CharacterType.KlingonWarrior) {
        instructionKey = "CareerLength.instruction.klingon";
    } else if (character.type === CharacterType.Civilian || character.type === CharacterType.AmbassadorDiplomat) {
        instructionKey = "CareerLength.instruction.civilian";
    }

    let message = (character.hasTalent(ADVANCED_TEAM_DYNAMICS)) ? (<div className="page-text">{t('CareerSelectionPage.exclusionText')}</div>) : undefined;

    return (
        <div className="page container ms-0">
            {character.stereotype === Stereotype.SoloCharacter
                ? (<SoloCharacterBreadcrumbs pageIdentity={PageIdentity.CareerLength}/>)
                : (<CharacterCreationBreadcrumbs />)}

            <Header>{t('Page.title.soloCareerLength')}</Header>
            <InstructionText text={t(instructionKey)} />
            {message}

            <div className="my-4">
                <Button className="btn btn-primary btn-sm me-3" onClick={() => setRandomLength( selectRandomCareerLength()) }>
                    <><img src="/static/img/d20.svg" style={{height: "24px", aspectRatio: "1"}} className="me-1" alt={t('Common.button.random')}/> {t('Common.button.random')}</>
                </Button>
                {randomLength != null ? (<Button className="btn btn-primary btn-sm me-3" onClick={() => setRandomLength(null)} >{t('Common.button.showAll')}</Button>) : undefined}
            </div>
            <table className="selection-list">
                <tbody>
                    {lengths}
                </tbody>
            </table>
        </div>);
}

export default connect(characterMapStateToProperties)(CareerLengthPage);