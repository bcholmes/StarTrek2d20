import React, { useState } from "react";
import { connect } from "react-redux";
import { Header } from "../../components/header";
import { Character } from "../../common/character";
import { navigateTo } from "../../common/navigator";
import { PageIdentity } from "../../pages/pageIdentity";
import { Button } from "../../components/button";
import { DropDownElement, DropDownSelect } from "../../components/dropDownInput";
import { MilestoneType } from "../model/milestoneType";
import { makeKey } from "../../common/translationKey";
import { Skill } from "../../helpers/skills";
import InstructionText from "../../components/instructionText";
import { StatControl } from "../../starship/view/statControl";
import { Dialog } from "../../components/dialog";
import store from "../../state/store";
import { applyNormalMilestoneDiscipline, applyNormalMilestoneFocus } from "../../state/characterActions";
import { CheckBox } from "../../components/checkBox";
import { InputFieldAndLabel } from "../../common/inputFieldAndLabel";
import { useTranslation } from "react-i18next";
import { ModifyBreadcrumb } from "../modifyBreadcrumb";
import { ModificationType } from "../model/modificationType";

interface IMilestonePageProperties {
    milestoneType: MilestoneType,
    character?: Character;
}

const MilestonePage: React.FC<IMilestonePageProperties> = ({character, milestoneType}) => {

    const [ normalOption, setNormalOption ] = useState(0);
    const [ normalDisciplineDecrease, setNormalDisciplineDecrease ] = useState(null);
    const [ normalDisciplineIncrease, setNormalDisciplineIncrease ] = useState(null);
    const [ normalDeletedFocus, setNormalDeletedFocus ] = useState(null);
    const [ normalAddedFocus, setNormalAddedFocus ] = useState(null);

    const { t } = useTranslation();

    function renderNormalMilestoneAdjustment() {
        if (normalOption === 0) {
            return (<>
                <div className="stats-row mt-4">
                    <StatControl statName={t(makeKey('Construct.discipline.', Skill[Skill.Command]))} value={getSkillValue(Skill.Command)}
                        showIncrease={canIncreaseSkill(Skill.Command)} showDecrease={canDecreaseSkill(Skill.Command)}
                        onIncrease={() => {increaseSkill(Skill.Command) }}
                        onDecrease={() => {decreaseSkill(Skill.Command)}} />

                    <StatControl statName={t(makeKey('Construct.discipline.', Skill[Skill.Security]))} value={getSkillValue(Skill.Security)}
                        showIncrease={canIncreaseSkill(Skill.Security)} showDecrease={canDecreaseSkill(Skill.Security)}
                        onIncrease={() => {increaseSkill(Skill.Security) }}
                        onDecrease={() => {decreaseSkill(Skill.Security)}} />

                    <StatControl statName={t(makeKey('Construct.discipline.', Skill[Skill.Science]))} value={getSkillValue(Skill.Science)}
                        showIncrease={canIncreaseSkill(Skill.Science)} showDecrease={canDecreaseSkill(Skill.Science)}
                        onIncrease={() => {increaseSkill(Skill.Science) }}
                        onDecrease={() => {decreaseSkill(Skill.Science)}} />
                </div>

                <div className="stats-row">
                    <StatControl statName={t(makeKey('Construct.discipline.', Skill[Skill.Conn]))} value={getSkillValue(Skill.Conn)}
                        showIncrease={canIncreaseSkill(Skill.Conn)} showDecrease={canDecreaseSkill(Skill.Conn)}
                        onIncrease={() => {increaseSkill(Skill.Conn) }}
                        onDecrease={() => {decreaseSkill(Skill.Conn)}} />

                    <StatControl statName={t(makeKey('Construct.discipline.', Skill[Skill.Engineering]))} value={getSkillValue(Skill.Engineering)}
                        showIncrease={canIncreaseSkill(Skill.Engineering)} showDecrease={canDecreaseSkill(Skill.Engineering)}
                        onIncrease={() => {increaseSkill(Skill.Engineering) }}
                        onDecrease={() => {decreaseSkill(Skill.Engineering)}} />

                    <StatControl statName={t(makeKey('Construct.discipline.', Skill[Skill.Medicine]))} value={getSkillValue(Skill.Medicine)}
                        showIncrease={canIncreaseSkill(Skill.Medicine)} showDecrease={canDecreaseSkill(Skill.Medicine)}
                        onIncrease={() => {increaseSkill(Skill.Medicine) }}
                        onDecrease={() => {decreaseSkill(Skill.Medicine)}} />
                </div>
            </>);
        } else {
            const focuses = character.focuses.map((f, i) => {
                return (
                    <tr key={i}>
                        <td>{f}</td>
                        <td>
                            <CheckBox
                                text=""
                                value={t.name}
                                isChecked={normalDeletedFocus === f}
                                onChanged={() => {
                                    selectNormalDeletedFocus(f);
                                } }/>
                        </td>
                    </tr>
                );
            });

            return (
                <div className="row">
                    <div className="col-md-6">
                        <Header level={2}>Replace Focus</Header>
                        <p>Select one of the following focuses to remove.</p>
                        <table className="selection-list">
                            <tbody>
                                {focuses}
                            </tbody>
                        </table>
                    </div>
                    <div className="col-md-6">
                        <Header level={2}>New Focus</Header>
                        <p>Choose a new, replacement focus.</p>

                        <InputFieldAndLabel id="newFocus" labelName={t('Construct.other.focus')}
                            value={normalAddedFocus || ""}
                            onChange={(focus) => setNormalAddedFocus(focus)} />
                    </div>
                </div>);
        }
    }

    function selectNormalDeletedFocus(focus: string) {
        setNormalDeletedFocus(focus);
    }

    function canIncreaseSkill(skill: Skill) {
        let base = character.departments[skill];
        if (normalDisciplineDecrease == null) {
            return false;
        } else if (base >= 4) {
            return false;
        } else if (normalDisciplineIncrease == null) {
            return true;
        } else if (normalDisciplineDecrease === skill && normalDisciplineIncrease == null) {
            return true;
        } else {
            return false;
        }
    }

    function canDecreaseSkill(skill: Skill) {
        let base = character.departments[skill];
        if (base <= 1) {
            return false;
        } else if (normalDisciplineIncrease === skill) {
            return true;
        } else if (normalDisciplineDecrease == null) {
            return true;
        } else {
            return false;
        }
    }

    function decreaseSkill(skill: Skill) {
        if (normalDisciplineIncrease === skill) {
            setNormalDisciplineIncrease(null);
        } else {
            setNormalDisciplineDecrease(skill);
        }
    }

    function increaseSkill(skill: Skill) {
        if (normalDisciplineDecrease === skill) {
            setNormalDisciplineDecrease(null);
        } else {
            setNormalDisciplineIncrease(skill);
        };
    }

    function getSkillValue(skill: Skill) {
        if (skill === normalDisciplineDecrease) {
            return character.departments[skill] - 1;
        } else if (skill === normalDisciplineIncrease) {
            return character.departments[skill] + 1;
        } else {
            return character.departments[skill];
        }
    }


    function describeNormalMilestoneOption() {
        if (normalOption === 0) {
            return "Reduce one discipline by 1 (to a minimum of 1) and increate a different discpline by 1 (to a maximum of 4)";
        } else {
            return "Choose a Focus and replace it with another Focus.";
        }
    }

    const getOptions = () => {
        return [ new DropDownElement(0, "Change discipline"), new DropDownElement(1, "Change focus")];
    }

    const nextPage = () => {
        if (normalOption === 0) {
            if (normalDisciplineDecrease == null || normalDisciplineIncrease == null) {
                Dialog.show("Decrease one discipline and increase another.");
            } else {
                store.dispatch(applyNormalMilestoneDiscipline(normalDisciplineDecrease, normalDisciplineIncrease));
                navigateTo(null, PageIdentity.ModificationCompletePage);
            }
        } else {
            if (!normalDeletedFocus || !normalAddedFocus) {
                Dialog.show("Please specify which focus you want to replace, and what the new focus is.");
            } else {
                store.dispatch(applyNormalMilestoneFocus(normalDeletedFocus, normalAddedFocus));
                navigateTo(null, PageIdentity.ModificationCompletePage);
            }
        }
    }


    return (<div className="page container ms-0">
        <ModifyBreadcrumb milestoneType={milestoneType} modificationType={ModificationType.Milestone} />

        <Header>{t(makeKey('Page.title.', MilestoneType[milestoneType]))}</Header>
        <p>{t('MilestonePage.instruction')}</p>

        <DropDownSelect items={getOptions()} onChange={(index) => setNormalOption(index as number)} defaultValue={normalOption}/>

        <div className="mt-4">
            <InstructionText text={describeNormalMilestoneOption()} />
        </div>

        {renderNormalMilestoneAdjustment()}

        <div className="mt-4 text-end">
            <Button onClick={() => nextPage()} className="btn btn-primary btn-sm">{t('Common.button.next')}</Button>
        </div>

    </div>);

}

function mapStateToProps(state, ownProps) {
    return {
        character: state.character.currentCharacter
    };
}

export default connect(mapStateToProps)(MilestonePage);
