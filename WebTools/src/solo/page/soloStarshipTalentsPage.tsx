import { useTranslation } from "react-i18next";
import { Starship } from "../../common/starship";
import { starshipMapStateToProperties } from "./soloCharacterProperties";
import { connect } from "react-redux";
import ReactMarkdown from "react-markdown";
import { Header } from "../../components/header";
import SoloStarshipBreadcrumbs from "../component/soloStarshipBreadcrumbs";
import { Button } from "../../components/button";
import replaceDiceWithArrowhead from "../../common/arrowhead";
import { CheckBox } from "../../components/checkBox";
import { CenturyPrerequisite, TalentModel, TalentsHelper, ToViewModel } from "../../helpers/talents";
import { Source } from "../../helpers/sources";
import { ServiceYearPrerequisite } from "../../helpers/prerequisite";
import store from "../../state/store";
import { setAdditionalTalents } from "../../state/starshipActions";
import { CharacterType } from "../../common/characterType";
import { Dialog } from "../../components/dialog";
import { Navigation } from "../../common/navigator";
import { PageIdentity } from "../../pages/pageIdentity";
import { StarshipRandomTalentTable } from "../table/starshipRandomTalentTable";

interface ISoloStarshipTalentsProperties {
    starship: Starship;
}

const SoloStarshipTalentsPage: React.FC<ISoloStarshipTalentsProperties> = ({starship}) => {

    const { t } = useTranslation();

    const randomTalents = () => {
        let talents = [];
        let count = starship.additionalTalents?.length;
        if (count > 0 && count < starship?.spaceframeModel?.scale) {
            talents = starship.additionalTalents.map(t => t.name);
        }

        while (talents.length < starship?.spaceframeModel?.scale) {
            let name = StarshipRandomTalentTable();
            if (talents.indexOf(name) < 0) {
                let talent = TalentsHelper.getTalent(name);
                if (talent != null && isTalentAllowed(talent)) {
                    talents.push(name);
                } else if (talent == null) {
                    console.log("Can't find talent " + name);
                }
            }
        }

        let talentViewModels = talents.map(n => ToViewModel(TalentsHelper.getTalent(n), 1, CharacterType.Starfleet));
        store.dispatch(setAdditionalTalents(talentViewModels));
    }

    const navigateToNextPage = () => {
        if (starship.additionalTalents?.length !== starship.scale) {
            Dialog.show(t('StarshipTalentSelection.instruction', { count: starship.scale, interpolation: { escapeValue: false } }));
        } else {
            Navigation.navigateToPage(PageIdentity.SoloStarshipFinish);
        }
    }

    const selectTalent = (talent: TalentModel) => {
        let talents = [...starship.additionalTalents];
        if (starship.hasTalent(talent.name)) {
            talents = talents.filter(t => t.name !== talent.name);
        } else {
            talents.push(ToViewModel(talent, 1, CharacterType.Starfleet));
            while (talents.length > starship.scale) {
                talents.splice(0, 1);
            }
        }

        store.dispatch(setAdditionalTalents(talents));
    }

    const isTalentAllowed = (t: TalentModel) => {
        let ok = (t.name !== "Cloaking Device" && t.name !== "Cloaked Mines");
        t.prerequisites.forEach(p => {
            if (p instanceof CenturyPrerequisite) {
                ok = ok && p.isPrerequisiteFulfilled(starship);
            } else if (p instanceof ServiceYearPrerequisite) {
                ok = ok && p.isPrerequisiteFulfilled(starship);
            }
        });
        return ok;
    }

    const talents = TalentsHelper.getTalents()
        .filter(t => t.category === "Starship")
        .filter(t => t.sources.indexOf(Source.CaptainsLog) >= 0)
        .filter(t => t.name !== "Cloaking Device" && t.name !== "Cloaked Mines")
        .filter(t => isTalentAllowed(t))
        .sort((t1, t2) => t1.localizedNameForSource(Source.CaptainsLog).localeCompare(t2.localizedNameForSource(Source.CaptainsLog)));

    const talentRows = talents.map((t, i) => {
        let prerequisites = undefined;
        t.prerequisites.forEach((p) => {
            let desc = p.describe();
            if (desc) {
                if (prerequisites == null) {
                    prerequisites = desc;
                } else {
                    prerequisites += (", " + desc);
                }
            }
        });

        let lines = t.description.split('\n').map((l, i) => {
            return (<div className={i === 0 ? '' : 'mt-2'} key={'d-' + i}>{replaceDiceWithArrowhead(l)}</div>);
        });

        return (
            <tr key={i}>
                <td className="selection-header-small">{t.localizedNameForSource(Source.CaptainsLog)}</td>
                <td>{lines}</td>
                <td>
                    <CheckBox
                        text=""
                        value={t.name}
                        isChecked={starship.hasTalent(t.name)}
                        onChanged={() => {
                            selectTalent(t);
                        } }/>
                </td>
            </tr>
        );
    });

    return (<div className="page container ms-0">
            <SoloStarshipBreadcrumbs />
            <Header>{t('Page.title.starshipTalentSelection')}</Header>

            <ReactMarkdown>
                {t('StarshipTalentSelection.instruction', { count: starship.scale, interpolation: { escapeValue: false } })}
            </ReactMarkdown>

            <div className="my-4">
                <Button buttonType={true} className="btn btn-primary btn-sm me-3" onClick={() => randomTalents()}>
                    <><img src="/static/img/d20.svg" style={{height: "24px", aspectRatio: "1"}} className="me-1" alt={t('Common.button.random')}/> {t('Common.button.random')}</>
                </Button>
            </div>
            <table className="selection-list mt-3">
                <tbody>
                    {talentRows}
                </tbody>
            </table>

            <div className='text-end mt-4'>
                <Button buttonType={true} className="btn btn-primary" onClick={() => navigateToNextPage() }>{t('Common.button.next')}</Button>
            </div>
        </div>);
}

export default connect(starshipMapStateToProperties)(SoloStarshipTalentsPage);