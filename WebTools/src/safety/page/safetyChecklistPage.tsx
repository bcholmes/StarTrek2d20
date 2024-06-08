import React from "react";
import { Header } from "../../components/header";
import { useTranslation } from "react-i18next";
import { PageIdentity } from "../../pages/pageIdentity";
import LcarsFrame from "../../components/lcarsFrame";
import ReactMarkdown from "react-markdown";
import { SafetySection, SafetySections } from "../model/safetySection";
import { SafetyEvaluation, SafetyEvaluationType } from "../model/safetyEvaluation";
import { connect } from "react-redux";
import store from "../../state/store";
import { setSafetyEvaluation } from "../../state/safetyActions";
import { SafetyChecklistPdf } from "../export/safetyPdf";
import { Button } from "../../components/button";
import { useNavigate } from "react-router";
import { preventDefaultAnchorEvent } from "../../common/navigator";

interface ISafetySectionViewProperties extends ISafetyChecklistPageProperties {
    section: SafetySection;
}

const SafetySectionView: React.FC<ISafetySectionViewProperties> = ({section, evaluation}) => {

    const select = (category: string, evaluation: SafetyEvaluationType) => {
        store.dispatch(setSafetyEvaluation(category, evaluation));
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
                                    checked={evaluation[category] === SafetyEvaluationType.AlwaysOk}
                                    onChange={() => select(category, SafetyEvaluationType.AlwaysOk)} /></td>
                                <td className="text-center"><input type="radio" name={category} value="YellowAlert"
                                    checked={evaluation[category] === SafetyEvaluationType.YellowAlert}
                                    onChange={() => select(category, SafetyEvaluationType.YellowAlert)} /></td>
                                <td className="text-center"><input type="radio" name={category} value="RedAlert"
                                    checked={evaluation[category] === SafetyEvaluationType.RedAlert}
                                    onChange={() => select(category, SafetyEvaluationType.RedAlert)} /></td>
                            </tr>);})}
                    </tbody>
                </table>
            </div>);

}


interface ISafetyChecklistPageProperties {
    evaluation: {[key: string]: SafetyEvaluationType }
}

const SafetyChecklistPage: React.FC<ISafetyChecklistPageProperties> = ({evaluation}) => {

    const { t } = useTranslation();
    const navigate = useNavigate();

    const exportPdf = () => {
        new SafetyChecklistPdf().export(evaluation);
    }

    const goToHome = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        e.stopPropagation();
        navigate("/");
    }

    return (<LcarsFrame activePage={PageIdentity.SectorDetails}>
        <div id="app">
            <div className="page">
                <div className="container ms-0">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/index.html" onClick={(e) => goToHome(e)}>{t('Page.title.home')}</a></li>
                            <li className="breadcrumb-item"><a href="/index.html" onClick={(e) => preventDefaultAnchorEvent(e, () => navigate("/tools"))}>{t('Page.title.otherTools')}</a></li>
                            <li className="breadcrumb-item active" aria-current="page">{t('Page.title.safetyChecklist')}</li>
                        </ol>
                    </nav>

                    <Header>{t('Page.title.safetyChecklist')}</Header>
                    <ReactMarkdown>{t("SafetyChecklist.instruction")}</ReactMarkdown>

                    <div className="row row-cols-1 row-cols-lg-2 my-3">
                        {SafetySections.instance.sections.map(s => (<SafetySectionView section={s} key={"section-" + s.type} evaluation={evaluation} />))}
                    </div>

                    <div className="mt-4 text-end">
                        <Button className='btn btn-primary btn-xs mw-100' onClick={() => exportPdf()}>{t('Common.button.export')}</Button>
                    </div>

                </div>
            </div>
        </div>
    </LcarsFrame>);
}

function mapStateToProps(state, ownProps) {
    return {
        evaluation: state.safety
    };
}

export default connect(mapStateToProps)(SafetyChecklistPage);