import React from "react";
import { connect } from "react-redux";
import { Navigation } from "../../common/navigator";
import { Starship } from "../../common/starship";
import { Button } from "../../components/button";
import { Dialog } from "../../components/dialog";
import { Header } from "../../components/header";
import SingleTalentSelectionList from "../../components/singleTalentSelectionList";
import { TalentsHelper, TalentViewModel, ToViewModel } from "../../helpers/talents";
import { nextStarshipWorkflowStep, setStarshipMissionProfile, setStarshipMissionProfileTalent } from "../../state/starshipActions";
import store from "../../state/store";
import { ShipBuildWorkflow } from "../model/shipBuildWorkflow";
import ShipBuildingBreadcrumbs from "../view/shipBuildingBreadcrumbs";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import { ITalent } from "../../helpers/italent";
import { StatView } from "../../components/StatView";
import { makeKey } from "../../common/translationKey";
import { Department } from "../../helpers/departments";
import { AttributeView } from "../../components/attribute";
import { allSystems, System } from "../../helpers/systems";
import { CheckBox } from "../../components/checkBox";

interface IMissionProfileTalentSelectionPageProperties {
    starship: Starship;
    workflow: ShipBuildWorkflow;
}

const MissionProfileTalentSelectionPage: React.FC<IMissionProfileTalentSelectionPageProperties> = ({starship, workflow}) => {
    const { t } = useTranslation();

    const saveTalent = (talent: ITalent) => {
        if (talent) {
            let talentModel = TalentsHelper.getTalent(talent.name);
            store.dispatch(setStarshipMissionProfileTalent(talentModel));
        } else {
            store.dispatch(setStarshipMissionProfileTalent(undefined));
        }
    }

    const getTalents = () => {
        let talents: TalentViewModel[] = [];
        starship?.missionProfileStep?.type?.talents?.forEach(t => {
            if (!t.isSourcePrerequisiteFulfilled(starship)) {
                // skip it
            } else if (!starship.spaceframeModel?.hasTalent(t.name)) {
                talents.push(ToViewModel(t, 1, starship?.type, starship?.version));
            } else if (t.maxRank > 1) {
                talents.push(ToViewModel(t, 2, starship?.type, starship?.version));
            }
        });
        return talents;
    }

    const nextPage = () => {
        if (starship.missionProfileStep?.talent == null) {
            Dialog.show(t('MissionProfileTalentSelection.error.talent'));
        } else if (starship.version > 1 && starship.missionProfileStep?.system == null) {
            Dialog.show(t("MissionProfileTalentSelection.error.system"));
        } else {
            let step = workflow.peekNextStep();
            store.dispatch(nextStarshipWorkflowStep());
            Navigation.navigateToPage(step.page);
        }
    }

    const onSelectSystem = (system: System) => {
        store.dispatch(setStarshipMissionProfile(starship.missionProfileStep?.type, system));
    }

    const renderSingleSystem = (system: System) => {
        return (<AttributeView name={t(makeKey('Construct.system.', System[system])) } points={1} value={starship.systems[system]}/>
    );
    }


    const renderSystemChoice = () => {
        return (<>
            <ReactMarkdown>{t('MissionProfileTalentSelection.instruction.system')}</ReactMarkdown>
            <table className="selection-list">
                <tbody>
                    {allSystems().map((s, i) => {
                        return (<tr key={i}>
                            <td className="selection-header-small">{t(makeKey("Construct.system.", System[s]))}</td>
                            <td className="text-end">
                                <CheckBox
                                    text=""
                                    value={s}
                                    isChecked={starship.missionProfileStep?.system === s}
                                    onChanged={(val) => {
                                        onSelectSystem(s);
                                    } }/>
                            </td>
                        </tr>)
                    })}
                </tbody>
            </table>
        </>);
    }

    return (<div className="page container ms-0">
        <ShipBuildingBreadcrumbs />
        <Header>{starship.version === 1 ? t('Page.title.missionProfileTalentSelection') : t('Page.title.missionProfileDetails')}</Header>
        {starship.version === 1
        ? undefined
        : (<>
            <div className="row">
                <div className="col-12 col-md-6">
                    <Header level={2} className="mt-4">{starship.missionProfileStep?.type?.localizedName}</Header>
                    <ReactMarkdown>{starship.missionProfileStep?.type?.localizedDescription}</ReactMarkdown>

                </div>
                <div className="col-12 col-md-6">
                    <Header level={2} className="mt-4">{t("Construct.other.departments")}</Header>
                    <div className="row row-cols-1 row-cols-lg-3 mt-3">
                        <StatView showZero={true} name={t(makeKey('Construct.department.', Department[Department.Command]))} value={starship.missionProfileStep?.type?.departments[Department.Command]} className="col mb-2" />
                        <StatView showZero={true} name={t(makeKey('Construct.department.', Department[Department.Security]))} value={starship.missionProfileStep?.type?.departments[Department.Security]} className="col mb-2" />
                        <StatView showZero={true} name={t(makeKey('Construct.department.', Department[Department.Science]))} value={starship.missionProfileStep?.type?.departments[Department.Science]} className="col mb-2" />
                        <StatView showZero={true} name={t(makeKey('Construct.department.', Department[Department.Conn]))} value={starship.missionProfileStep?.type?.departments[Department.Conn]} className="col mb-2" />
                        <StatView showZero={true} name={t(makeKey('Construct.department.', Department[Department.Engineering]))} value={starship.missionProfileStep?.type?.departments[Department.Engineering]} className="col mb-2" />
                        <StatView showZero={true} name={t(makeKey('Construct.department.', Department[Department.Medicine]))} value={starship.missionProfileStep?.type?.departments[Department.Medicine]} className="col mb-2" />
                    </div>

                    <Header level={2} className="mt-4">{t("Construct.other.systems")}</Header>
                    {starship.missionProfileStep?.type?.systems?.length === 1
                        ? renderSingleSystem(starship.missionProfileStep.type.systems[0])
                        : renderSystemChoice()}
                </div>
            </div>
            <Header level={2} className="mt-4">{t('Construct.other.talent')}</Header>
        </>)}

        <ReactMarkdown>{t('MissionProfileTalentSelection.instruction')}</ReactMarkdown>
        <SingleTalentSelectionList
            talents={getTalents()}
            initialSelection={starship.missionProfileStep?.talent}
            construct={starship}
            onSelection={(talent) => saveTalent(talent)} />
        <div className="text-end mt-4">
            <Button onClick={() => nextPage()}>{t('Common.button.next')}</Button>
        </div>
    </div>);

}

function mapStateToProps(state, ownProps) {
    return {
        starship: state.starship.starship,
        workflow: state.starship.workflow
    };
}

export default connect(mapStateToProps)(MissionProfileTalentSelectionPage);