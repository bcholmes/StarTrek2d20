import React from "react";
import { withTranslation, WithTranslation } from 'react-i18next';
import { makeKey } from "../common/translationKey";
import { Button } from "../components/button";
import { Header } from "../components/header";
import { StatView } from "../components/StatView";
import { Attribute } from "../helpers/attributes";
import { marshaller } from "../helpers/marshaller";
import { Skill } from "../helpers/skills";
import { CharacterWithTracking } from "./model/characterWithTracking";

interface IGMCharacterViewProperties extends WithTranslation {

    character: CharacterWithTracking;
}

class GMCharacterView extends React.Component<IGMCharacterViewProperties, {}> {

    render() {
        const { t } = this.props;
        const character = this.props.character?.character;

        return (<div className="mb-3">
            <Header level={2}>{character.nameAndFullRank}</Header>
            <div className="row">
                <div className="col-lg-5">
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

                <div className="col-lg-3">

                </div>

                <div className="col-lg-4">
                    <textarea className="w-100 h-100" placeholder="Notes..."></textarea>
                </div>
            </div>
            <div className="row mt-2">
                <div className="col-lg-9">
                    <div className="text-white"><b>{t('Construct.other.focuses')}:</b> {character.focuses.map((f, i) => (i > 0 ? ', ' : '') + f)}</div>
                    <div className="text-white"><b>{t('Construct.other.talents')}:</b> {character.getTalentNameList().map((t, i) => (i > 0 ? ', ' : '') + t)}</div>
                </div>
                <div className="col-lg-3 text-right">
                    <Button buttonType={true} className="btn btn-link" onClick={() => this.viewCharacter()}><i className="bi bi-eyeglasses"></i></Button>
                </div>
            </div>
        </div>)
    }

    viewCharacter() {
        const { character } = this.props;
        const value = marshaller.encodeMainCharacter(character?.character);
        window.open('/view?s=' + value, "_blank");
    }
}

export default withTranslation()(GMCharacterView)