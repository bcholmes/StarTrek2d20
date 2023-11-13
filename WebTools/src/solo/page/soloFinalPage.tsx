import { useTranslation } from "react-i18next";
import { ISoloCharacterProperties, soloCharacterMapStateToProperties } from "./soloCharacterProperties";
import { PageIdentity } from "../../pages/pageIdentity";
import { Header } from "../../components/header";
import { connect } from "react-redux";
import store from "../../state/store";
import { setCharacterAssignment, setCharacterName, setCharacterPronouns, setCharacterRank } from "../../state/characterActions";
import { InputFieldAndLabel } from "../../common/inputFieldAndLabel";
import { Button } from "../../components/button";
import { CharacterSheetDialog } from "../../components/characterSheetDialog";
import { CharacterSheetRegistry } from "../../helpers/sheets";
import SoloCharacterBreadcrumbs from "../component/soloCharacterBreadcrumbs";
import { DropDownElement, DropDownSelect } from "../../components/dropDownInput";
import { Rank, RanksHelper } from "../../helpers/ranks";
import { useState } from "react";
import { Role, RolesHelper } from "../../helpers/roles";
import { marshaller } from "../../helpers/marshaller";

const SoloFinalPage: React.FC<ISoloCharacterProperties> = ({character}) => {
    const { t } = useTranslation();
    let rankValue: string|Rank = "";
    let rankName = "";
    if (character.rank) {
        rankValue = character.rank.id ?? "other";
        if (character.rank.id == null) {
            rankName = character.rank.name;
        }
    }

    let assignment: string|Role = character.role ? RolesHelper.instance.getRoleByName(character.role) : null;

    const [showAssignmentOther, setShowAssignmentOther] = useState(!!character.jobAssignment);
    const [showRankOther, setShowRankOther] = useState(rankValue === "other");

    if (showAssignmentOther) {
        assignment = "other";
    }

    const assignmentOptions = () => {
        let result = [new DropDownElement("", t('Common.text.select')), new DropDownElement("other", "Other")];
        [Role.CommandingOfficer, Role.ExecutiveOfficer, Role.OperationsManager, Role.FlightController, Role.ChiefEngineer,
            Role.ChiefOfSecurity, Role.ChiefMedicalOfficer, Role.ScienceOfficer, Role.CommunicationsOfficer]
            .forEach(r => result.push(new DropDownElement(r, RolesHelper.instance.getSoloRole(r).name)));
        return result;
    }

    const showDialog = () => {
        setTimeout(() => {
            let c = store.getState().character.currentCharacter;
            CharacterSheetDialog.show(CharacterSheetRegistry.getCharacterSheets(c), "sta-solo-character", c);
        }, 200);
    }

    const rankOptions = () => {
        let result = [new DropDownElement("", t('Common.text.select')), new DropDownElement("other", "Other")];
        [Rank.Captain, Rank.Commander, Rank.LtCommander, Rank.Lieutenant, Rank.LieutenantJG, Rank.Ensign]
            .forEach(r => result.push(new DropDownElement(r, RanksHelper.instance().getRank(r).name)));
        return result;
    }

    const rankSelected = (id: string|Rank) => {
        if (id === "other") {
            setShowRankOther(true);
        } else {
            if (id !== "") {
                let rank = RanksHelper.instance().getRank(id as Rank);
                store.dispatch(setCharacterRank(rank.name, id as Rank));
            }

            if (showRankOther) {
                setShowRankOther(false);
            }
        }
    }

    const assignmentSelected = (assignment: string|Role, name?: string) => {
        if (assignment === "other") {
            setShowAssignmentOther(true);
            if (name) {
                store.dispatch(setCharacterAssignment(name))
            }
        } else if (assignment === "") {
            setShowAssignmentOther(false);
            store.dispatch(setCharacterAssignment(undefined))
        } else if (typeof assignment !== 'string') {
            if (showAssignmentOther) {
                setShowAssignmentOther(false);
            }
            let role = RolesHelper.instance.getSoloRole(assignment as Role);
            if (role) {
                store.dispatch(setCharacterAssignment(assignment as Role));
            }
        }
    }

    if (showRankOther) {
        rankValue = "other";
    }

    const showViewPage = () => {
        setTimeout(() => {
            let c = store.getState().character.currentCharacter;
            const value = marshaller.encodeSoloCharacter(c);
            window.open('/view?s=' + value, "_blank");
        });
    }

    return (
        <div className="page container ml-0">
            <SoloCharacterBreadcrumbs pageIdentity={PageIdentity.SoloFinal} />

            <Header>{t('Page.title.soloFinal')}</Header>

            <div className="row">
                <div className="col-md-6 my-3">
                    <Header level={2} className="mb-3">{t('Construct.other.name')}</Header>

                    <InputFieldAndLabel id="name" labelName={t('Construct.other.name')}
                        value={character.name || ""}
                        onChange={(v) => store.dispatch(setCharacterName(v))} />

                    <InputFieldAndLabel id="pronouns" labelName={t('Construct.other.pronouns')}
                        value={character.pronouns || ""}
                        onChange={(v) => store.dispatch(setCharacterPronouns(v))} />

                </div>

                <div className="col-md-6 my-3">
                    <Header level={2} className="mb-3">{t('Construct.other.assignment')}</Header>

                    <DropDownSelect items={assignmentOptions()} defaultValue={assignment} onChange={r => assignmentSelected(r)} />

                    {showAssignmentOther
                        ? (<div>
                            <InputFieldAndLabel id="assignmentOther" labelName={t('Construct.other.assignment')}
                                value={character.jobAssignment ?? ""}
                                onChange={(v) => assignmentSelected("other", v)} />
                            </div>)
                        : undefined}

                </div>

                { character.isCivilian()
                ? undefined
                : (<div className="col-md-6 my-3">
                    <Header level={2} className="mb-3">{t('Construct.other.rank')}</Header>

                    <DropDownSelect items={rankOptions()} defaultValue={rankValue} onChange={r => rankSelected(r)} />

                    {showRankOther
                        ? (<div>
                            <InputFieldAndLabel id="rankOther" labelName={t('Construct.other.rank')}
                                value={rankName ?? ""}
                                onChange={(v) => store.dispatch(setCharacterRank(v))} />
                            </div>)
                        : undefined}
                </div>)}
            </div>
            <div className="button-container my-5">
                <Button buttonType={true} text={t('Common.button.exportPdf')} className="btn btn-primary btn-sm mr-3" onClick={() => showDialog() }  />
                <Button buttonType={true} text={t('Common.button.view')} className="btn btn-primary btn-sm mr-3" onClick={() => showViewPage() }  />
            </div>

        </div>);

}


export default connect(soloCharacterMapStateToProperties)(SoloFinalPage);