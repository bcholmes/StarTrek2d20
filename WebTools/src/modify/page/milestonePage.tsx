import React from "react";
import { connect } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router";
import { withTranslation, WithTranslation } from 'react-i18next';
import { Header } from "../../components/header";
import { Character } from "../../common/character";
import { navigateTo, Navigator } from "../../common/navigator";
import { PageIdentity } from "../../pages/pageIdentity";
import { Button } from "../../components/button";
import { DropDownInput } from "../../components/dropDownInput";
import { MilestoneType } from "../model/milestoneType";
import { makeKey } from "../../common/translationKey";
import { Skill } from "../../helpers/skills";
import InstructionText from "../../components/instructionText";
import { StatControl } from "../../starship/view/statControl";
import { Dialog } from "../../components/dialog";
import store from "../../state/store";
import { applyNormalMilestoneDiscipline } from "../../state/characterActions";

interface IMilestonePageProperties extends WithTranslation {
    milestoneType: MilestoneType,
    character?: Character;
    history: RouteComponentProps["history"];
}

interface IMilestonePageState {
    normalOption: number,
    normalDisciplineDecrease?: Skill,
    normalDisciplineIncrease?: Skill
}

class MilestonePage extends React.Component<IMilestonePageProperties, IMilestonePageState> {

    constructor(props) {
        super(props);

        this.state = {
            normalOption: 0
        };
    }

    render() {
        const { t, milestoneType } = this.props;
        return (<div className="page container ml-0">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => this.goToHome(e)}>{t('Page.title.home')}</a></li>
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.ModificationTypeSelection)}>{t('Page.title.modificationTypeSelection')}</a></li>
                    <li className="breadcrumb-item active" aria-current="page">{t(makeKey('Page.title.', MilestoneType[milestoneType]))}</li>
                </ol>
            </nav>

            <Header>{t(makeKey('Page.title.', MilestoneType[milestoneType]))}</Header>
            <p>{t('MilestonePage.instruction')}</p>

            <DropDownInput items={this.getOptions()} onChange={(index) => this.setState((state) => ({
                            ...state,
                            normalOption: index
                        }))} defaultValue={this.getOptions()[this.state.normalOption]}/>

            <div className="mt-4">
                <InstructionText text={this.describeNormalMilestoneOption()} />
            </div>

            {this.renderNormalMilestoneAdjustment()}

            <div className="mt-4 text-right">
                <Button buttonType={true} onClick={() => this.nextPage()} className="btn btn-primary btn-sm">{t('Common.button.next')}</Button>
            </div>

        </div>);
    }

    renderNormalMilestoneAdjustment() {
        const { t } = this.props;
        if (this.state.normalOption === 0) {
            return (<>
                <div className="stats-row mt-4">
                    <StatControl statName={t(makeKey('Construct.discipline.', Skill[Skill.Command]))} value={this.getSkillValue(Skill.Command)}
                        showIncrease={this.canIncreaseSkill(Skill.Command)} showDecrease={this.canDecreaseSkill(Skill.Command)}
                        onIncrease={() => {this.increaseSkill(Skill.Command) }}
                        onDecrease={() => {this.decreaseSkill(Skill.Command)}} />

                    <StatControl statName={t(makeKey('Construct.discipline.', Skill[Skill.Security]))} value={this.getSkillValue(Skill.Security)}
                        showIncrease={this.canIncreaseSkill(Skill.Security)} showDecrease={this.canDecreaseSkill(Skill.Security)}
                        onIncrease={() => {this.increaseSkill(Skill.Security) }}
                        onDecrease={() => {this.decreaseSkill(Skill.Security)}} />

                    <StatControl statName={t(makeKey('Construct.discipline.', Skill[Skill.Science]))} value={this.getSkillValue(Skill.Science)}
                        showIncrease={this.canIncreaseSkill(Skill.Science)} showDecrease={this.canDecreaseSkill(Skill.Science)}
                        onIncrease={() => {this.increaseSkill(Skill.Science) }}
                        onDecrease={() => {this.decreaseSkill(Skill.Science)}} />
                </div>

                <div className="stats-row">
                    <StatControl statName={t(makeKey('Construct.discipline.', Skill[Skill.Conn]))} value={this.getSkillValue(Skill.Conn)}
                        showIncrease={this.canIncreaseSkill(Skill.Conn)} showDecrease={this.canDecreaseSkill(Skill.Conn)}
                        onIncrease={() => {this.increaseSkill(Skill.Conn) }}
                        onDecrease={() => {this.decreaseSkill(Skill.Conn)}} />

                    <StatControl statName={t(makeKey('Construct.discipline.', Skill[Skill.Engineering]))} value={this.getSkillValue(Skill.Engineering)}
                        showIncrease={this.canIncreaseSkill(Skill.Engineering)} showDecrease={this.canDecreaseSkill(Skill.Engineering)}
                        onIncrease={() => {this.increaseSkill(Skill.Engineering) }}
                        onDecrease={() => {this.decreaseSkill(Skill.Engineering)}} />

                    <StatControl statName={t(makeKey('Construct.discipline.', Skill[Skill.Medicine]))} value={this.getSkillValue(Skill.Medicine)}
                        showIncrease={this.canIncreaseSkill(Skill.Medicine)} showDecrease={this.canDecreaseSkill(Skill.Medicine)}
                        onIncrease={() => {this.increaseSkill(Skill.Medicine) }}
                        onDecrease={() => {this.decreaseSkill(Skill.Medicine)}} />
                </div>
            </>);
        } else {
            return null;
        }
    }

    canIncreaseSkill(skill: Skill) {
        let base = this.props.character.skills[skill].expertise;
        if (this.state.normalDisciplineDecrease == null) {
            return false;
        } else if (base >= 4) {
            return false;
        } else if (this.state.normalDisciplineIncrease == null) {
            return true;
        } else if (this.state.normalDisciplineDecrease === skill && this.state.normalDisciplineIncrease == null) {
            return true;
        } else {
            return false;
        }
    }

    canDecreaseSkill(skill: Skill) {
        let base = this.props.character.skills[skill].expertise;
        if (base <= 1) {
            return false;
        } else if (this.state.normalDisciplineIncrease === skill) {
            return true;
        } else if (this.state.normalDisciplineDecrease == null) {
            return true;
        } else {
            return false;
        }
    }

    decreaseSkill(skill: Skill) {
        this.setState((state) => {
            if (state.normalDisciplineIncrease === skill) {
                return {
                    ...state,
                    normalDisciplineIncrease: null
                }
            } else {
                return {
                    ...state,
                    normalDisciplineDecrease: skill
                }
            }
        });
    }

    increaseSkill(skill: Skill) {
        this.setState((state) => {
            if (state.normalDisciplineDecrease === skill) {
                return {
                    ...state,
                    normalDisciplineDecrease: null
                }
            } else {
                return {
                    ...state,
                    normalDisciplineIncrease: skill
                }
            }
        });
    }

    getSkillValue(skill: Skill) {
        if (skill === this.state.normalDisciplineDecrease) {
            return this.props.character.skills[skill].expertise - 1;
        } else if (skill === this.state.normalDisciplineIncrease) {
            return this.props.character.skills[skill].expertise + 1;
        } else {
            return this.props.character.skills[skill].expertise;
        }
    }


    describeNormalMilestoneOption() {
        if (this.state.normalOption === 0) {
            return "Reduce one discipline by 1 (to a minimum of 1) and increate a different discpline by 1 (to a maximum of 4)";
        } else {
            return "Choose a Focus and replace it with another Focus.";
        }
    }

    getOptions() {
        return [ "Change discipline", "Change focus"];
    }

    nextPage() {
        if (this.state.normalOption === 0) {
            if (this.state.normalDisciplineDecrease == null || this.state.normalDisciplineIncrease == null) {
                Dialog.show("Decrease one discipline and increase another.");
            } else {
                store.dispatch(applyNormalMilestoneDiscipline(this.state.normalDisciplineDecrease, this.state.normalDisciplineIncrease));
                navigateTo(null, PageIdentity.ModificationCompletePage);
            }
        } else {
            Dialog.show("Weird!");
        }
    }

    goToHome(e: React.MouseEvent<HTMLAnchorElement>) {
        e.preventDefault();
        e.stopPropagation();

        const { history } = this.props;
        history.push("/");
    }
}

function mapStateToProps(state, ownProps) {
    return {
        character: state.character.currentCharacter
    };
}

export default withTranslation()(withRouter(connect(mapStateToProps)(MilestonePage)));
