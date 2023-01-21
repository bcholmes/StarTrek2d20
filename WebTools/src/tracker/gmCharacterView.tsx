import React from "react";
import { withTranslation, WithTranslation } from 'react-i18next';
import { makeKey } from "../common/translationKey";
import { Button } from "../components/button";
import { Header } from "../components/header";
import { StatView } from "../components/StatView";
import { Attribute } from "../helpers/attributes";
import { marshaller } from "../helpers/marshaller";
import { getNameAndShortRankOf } from "../helpers/ranks";
import { Skill } from "../helpers/skills";
import { removeGMTrackedCharacter, setGMTrackedCharacterNotes, setGMTrackedCharacterStress } from "../state/gmTrackerActions";
import store from "../state/store";
import { CharacterWithTracking } from "./model/characterWithTracking";

interface IGMCharacterViewProperties extends WithTranslation {

    tracking: CharacterWithTracking;
}

class GMCharacterView extends React.Component<IGMCharacterViewProperties, {}> {

    render() {
        const { t, tracking } = this.props;
        const character = this.props.tracking?.character;

        return (<div className="mb-2">
            <Header level={2}>{getNameAndShortRankOf(character)}</Header>
            <div className="text-white">{character.speciesName}{this.renderJob()}</div>
            <div className="d-lg-flex justify-content-between">
                <div className="mb-2" style={{width: "380px"}}>
                    <div className="row row-cols-1 row-cols-md-3 mt-1">
                        <StatView name={t(makeKey('Construct.attribute.', Attribute[Attribute.Control]))} value={character.attributes ? character.attributes[Attribute.Control].value : undefined} className="col mb-1" size="sm"/>
                        <StatView name={t(makeKey('Construct.attribute.', Attribute[Attribute.Fitness]))} value={character.attributes ? character.attributes[Attribute.Fitness].value : undefined} className="col mb-1" size="sm" />
                        <StatView name={t(makeKey('Construct.attribute.', Attribute[Attribute.Presence]))} value={character.attributes ? character.attributes[Attribute.Presence].value : undefined} className="col mb-1" size="sm" />
                        <StatView name={t(makeKey('Construct.attribute.', Attribute[Attribute.Daring]))} value={character.attributes ? character.attributes[Attribute.Daring].value : undefined} className="col mb-1" size="sm" />
                        <StatView name={t(makeKey('Construct.attribute.', Attribute[Attribute.Insight]))} value={character.attributes ? character.attributes[Attribute.Insight].value : undefined} className="col mb-1" size="sm" />
                        <StatView name={t(makeKey('Construct.attribute.', Attribute[Attribute.Reason]))} value={character.attributes ? character.attributes[Attribute.Reason].value : undefined} className="col mb-1" size="sm" />
                    </div>

                    <div className="row row-cols-1 row-cols-md-3 mt-1">
                        <StatView name={t(makeKey('Construct.discipline.', Skill[Skill.Command]))} value={character.skills ? character.skills[Skill.Command].expertise : undefined} className="col mb-1" size="sm" />
                        <StatView name={t(makeKey('Construct.discipline.', Skill[Skill.Security]))} value={character.skills ? character.skills[Skill.Security].expertise : undefined} className="col mb-1" size="sm" />
                        <StatView name={t(makeKey('Construct.discipline.', Skill[Skill.Science]))} value={character.skills ? character.skills[Skill.Science].expertise : undefined} className="col mb-1" size="sm" />
                        <StatView name={t(makeKey('Construct.discipline.', Skill[Skill.Conn]))} value={character.skills ? character.skills[Skill.Conn].expertise : undefined} className="col mb-1" size="sm" />
                        <StatView name={t(makeKey('Construct.discipline.', Skill[Skill.Engineering]))} value={character.skills ? character.skills[Skill.Engineering].expertise : undefined} className="col mb-1" size="sm" />
                        <StatView name={t(makeKey('Construct.discipline.', Skill[Skill.Medicine]))} value={character.skills ? character.skills[Skill.Medicine].expertise : undefined} className="col mb-1" size="sm" />
                    </div>
                </div>

                <div className="mb-2" style={{ width: "180px"}}>
                    {this.renderStress()}
                </div>

                <div className="mb-2" style={{width: "300px"}}>
                    <textarea className="w-100 h-100" placeholder="Notes..." onChange={(e) => this.changeNotes(e.target.value)} value={tracking.notes}></textarea>
                </div>
            </div>
            <div className="row mt-2">
                <div className="col-lg-9">
                    <div className="text-white"><b>{t('Construct.other.focuses')}:</b> {character.focuses?.map((f, i) => (i > 0 ? ', ' : '') + f)}</div>
                    <div className="text-white"><b>{t('Construct.other.talents')}:</b> {character.getTalentNameList()?.map((t, i) => (i > 0 ? ', ' : '') + t)}</div>
                </div>
                <div className="col-lg-3 text-right">
                    <Button buttonType={true} className="btn btn-link" onClick={() => this.viewCharacter()}><i className="bi bi-eyeglasses"></i></Button>
                    <Button buttonType={true} className="btn btn-link text-danger" onClick={() => this.removeCharacter()}><i className="bi bi-trash"></i></Button>
                </div>
            </div>
        </div>)
    }

    renderJob() {
        let result = "";
        const { character } = this.props.tracking;
        if (character.role) {
            result += character.role;
        }
        if (character.jobAssignment) {
            if (result.length) {
                result += ", ";
            }
            result += character.jobAssignment;
        }
        if (character.assignedShip) {
            if (result.length) {
                result += ", ";
            }
            result += character.assignedShip;
        }
        return (result.length) ? ", " + result : "";
    }

    renderStress() {
        let tracking = this.props.tracking;
        let stress = tracking?.character?.stress;
        if (stress) {
            let iterator = [];
            for (let i = 1; i <= stress; i++) {
                iterator.push(i);
            }

            const pills = iterator.map(i => {
                return (<div className="empty-pill compact mb-1 text-center text-white" role="button" key={'stress-' + i}
                    onClick={() => this.changeStress(i+1)}>
                    {i < tracking.currentStress ? (<i className="bi bi-check"></i>) : null }
                </div>);
            });
            return (<div className="d-flex flex-wrap mb-1">
                    {pills}
                </div>);
        } else {
            return undefined;
        }
    }

    changeStress(i: number) {
        const { tracking } = this.props;
        let stress = i;
        if (i === tracking.currentStress && i > 0) {
            stress--;
        }
        store.dispatch(setGMTrackedCharacterStress(tracking, stress));
    }

    changeNotes(notes: string) {
        const { tracking } = this.props;
        store.dispatch(setGMTrackedCharacterNotes(tracking, notes));
    }

    viewCharacter() {
        const { tracking } = this.props;

        if (tracking?.character?.upbringingStep == null && tracking?.character?.environmentStep == null) {
            const value = marshaller.encodeSupportingCharacter(tracking?.character);
            window.open('/view?s=' + value, "_blank");
        } else {
            const value = marshaller.encodeMainCharacter(tracking?.character);
            window.open('/view?s=' + value, "_blank");
        }
    }

    removeCharacter() {
        const { tracking } = this.props;
        store.dispatch(removeGMTrackedCharacter(tracking));
    }
}

export default withTranslation()(GMCharacterView)