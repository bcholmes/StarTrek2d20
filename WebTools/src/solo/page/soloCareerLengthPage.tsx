import { useTranslation } from "react-i18next";
import { Navigation } from "../../common/navigator";
import { PageIdentity } from "../../pages/pageIdentity";
import { Header } from "../../components/header";
import InstructionText from "../../components/instructionText";
import { ISoloCharacterProperties, soloCharacterMapStateToProperties } from "./soloCharacterProperties";
import React, { useState } from "react";
import { connect } from "react-redux";
import { CareerModel, CareersHelper } from "../../helpers/careers";
import { Window } from "../../common/window";
import { Button } from "../../components/button";
import { CareerLengthRandomTable } from "../table/careerLengthRandomTable";
import store from "../../state/store";
import { setCharacterCareerLength } from "../../state/characterActions";
import SoloCharacterBreadcrumbs from "../component/soloCharacterBreadcrumbs";

const SoloCareerLengthPage: React.FC<ISoloCharacterProperties> = ({character}) => {

    const { t } = useTranslation();
    const [randomLength, setRandomLength] = useState(character?.careerStep?.career);

    const careerLengthSelected = (careerLength: CareerModel)=> {
        store.dispatch(setCharacterCareerLength(careerLength.id));
        Navigation.navigateToPage(PageIdentity.SoloCareerLengthDetails);
    }

    const toTableRow = (careerLength: CareerModel, i: number) => {
        return (
            <tr key={i} onClick={() => { if (Window.isCompact()) careerLengthSelected(careerLength); }}>
                <td className="selection-header">{careerLength.localizedName}</td>
                <td className="text-right"><Button buttonType={true} className="btn btn-primary btn-sm"
                    text={t('Common.button.select')} onClick={() => { careerLengthSelected(careerLength) }}
                /></td>
            </tr>
        );
    }

    const lengths = randomLength != null
        ? toTableRow(CareersHelper.instance.getSoloCareerLength(randomLength), 0)
        : CareersHelper.instance.getSoloCareerLengths().map((c, i) => toTableRow(c, i));

    return (
        <div className="page container ml-0">
            <SoloCharacterBreadcrumbs pageIdentity={PageIdentity.SoloCareerLength}/>

            <Header>{t('Page.title.soloCareerLength')}</Header>
            <InstructionText text={t('SoloCareerLength.instruction')} />
            <div className="my-4">
                <Button buttonType={true} className="btn btn-primary btn-sm mr-3" onClick={() => setRandomLength( CareerLengthRandomTable()) }>
                    <><img src="/static/img/d20.svg" style={{height: "24px", aspectRatio: "1"}} className="mr-1" alt={t('Common.button.random')}/> {t('Common.button.random')}</>
                </Button>
                {randomLength != null ? (<Button buttonType={true} className="btn btn-primary btn-sm mr-3" onClick={() => setRandomLength(null)} >{t('Common.button.showAll')}</Button>) : undefined}
            </div>
            <table className="selection-list">
                <tbody>
                    {lengths}
                </tbody>
            </table>
        </div>);
}

export default connect(soloCharacterMapStateToProperties)(SoloCareerLengthPage);