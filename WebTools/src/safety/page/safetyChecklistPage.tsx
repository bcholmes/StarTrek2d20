import React, { useState } from "react";
import { Header } from "../../components/header";
import { useTranslation } from "react-i18next";
import { navigateTo } from "../../common/navigator";
import { PageIdentity } from "../../pages/pageIdentity";
import LcarsFrame from "../../components/lcarsFrame";
import ReactMarkdown from "react-markdown";
import { SafetySection, SafetySections } from "../model/safetySection";
import { SafetyEvaluation, SafetyEvaluationType } from "../model/safetyEvaluation";

interface ISafetySectionViewProperties {
    section: SafetySection;
}

const SafetySectionView: React.FC<ISafetySectionViewProperties> = ({section}) => {

    const [ selections, setSelections ] = useState({});

    const select = (category: string, evaluation: SafetyEvaluationType) => {
        let temp = {...selections};
        temp[category] = evaluation;
        setSelections(temp);
    }

    return (<div className="col my-3">
                <Header level={2}>{section.localizedName}</Header>

                <table className="table table-dark">
                    <colgroup>
                        <col width="55%" />
                        <col width="15%" />
                        <col width="15%" />
                        <col width="15%" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th className="bg-black"></th>
                            {SafetyEvaluation.allTypes.map(t => (<th className="bg-black" key={"section-header-" + section.type + "-" + t.type}>{t.localizedName}</th>))}
                        </tr>
                    </thead>
                    <tbody>
                        {section.localizedCategories.map((c,i) => {
                            let category = section.categories[i];
                            return (<tr key={"section-category-" + category}>
                                <td>{c}</td>
                                <td className="text-center"><input type="radio" name={category} value="AlwaysOk"
                                    checked={selections[category] === SafetyEvaluationType.AlwaysOk}
                                    onChange={() => select(category, SafetyEvaluationType.AlwaysOk)} /></td>
                                <td className="text-center"><input type="radio" name={category} value="YellowAlert"
                                    checked={selections[category] === SafetyEvaluationType.YellowAlert}
                                    onChange={() => select(category, SafetyEvaluationType.YellowAlert)} /></td>
                                <td className="text-center"><input type="radio" name={category} value="RedAlert"
                                    checked={selections[category] === SafetyEvaluationType.RedAlert}
                                    onChange={() => select(category, SafetyEvaluationType.RedAlert)} /></td>
                            </tr>);})}
                    </tbody>
                </table>
            </div>);

}


const SafetyChecklistPage = () => {

    const { t } = useTranslation();

    return (<LcarsFrame activePage={PageIdentity.SectorDetails}>
        <div id="app">
            <div className="page">
                <div className="container ms-0">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/index.html" onClick={(e) => navigateTo(e, PageIdentity.Home)}>{t('Page.title.home')}</a></li>
                            <li className="breadcrumb-item active" aria-current="page">{t('Page.title.safetyChecklist')}</li>
                        </ol>
                    </nav>

                    <Header>{t('Page.title.safetyChecklist')}</Header>
                    <ReactMarkdown>{t("SafetyChecklist.instruction")}</ReactMarkdown>

                    <div className="row row-cols-1 row-cols-lg-2 my-3">
                        {SafetySections.instance.sections.map(s => (<SafetySectionView section={s} key={"section-" + s.type} />))}
                    </div>
                </div>
            </div>
        </div>
    </LcarsFrame>);
}

export default SafetyChecklistPage;