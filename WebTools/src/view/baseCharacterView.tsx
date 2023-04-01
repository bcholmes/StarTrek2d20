import React from "react";
import { RouteComponentProps } from "react-router";
import { Character } from "../common/character";
import { WithTranslation } from 'react-i18next';
import { Header } from "../components/header";
import { StatView } from "../components/StatView";
import { makeKey } from "../common/translationKey";
import { Attribute } from "../helpers/attributes";
import { Skill } from "../helpers/skills";
import WeaponView from "../components/weaponView";
import { VttSelectionDialog } from "../vtt/view/VttSelectionDialog";

export interface ICharacterViewProperties extends WithTranslation {
    character: Character;
    showButtons?: boolean;
    history: RouteComponentProps["history"];
}

export abstract class BaseCharacterView extends React.Component<ICharacterViewProperties, {}> {


    renderStats() {
        const { t, character } = this.props;

        return (<>
            <Header level={2}>{t('Construct.other.attributes')}</Header>

            <div className="row row-cols-1 row-cols-md-3 mt-3">
                <StatView name={t(makeKey('Construct.attribute.', Attribute[Attribute.Control]))} value={character.attributes ? character.attributes[Attribute.Control].value : undefined} className="col mb-2" />
                <StatView name={t(makeKey('Construct.attribute.', Attribute[Attribute.Fitness]))} value={character.attributes ? character.attributes[Attribute.Fitness].value : undefined} className="col mb-2" />
                <StatView name={t(makeKey('Construct.attribute.', Attribute[Attribute.Presence]))} value={character.attributes ? character.attributes[Attribute.Presence].value : undefined} className="col mb-2" />
                <StatView name={t(makeKey('Construct.attribute.', Attribute[Attribute.Daring]))} value={character.attributes ? character.attributes[Attribute.Daring].value : undefined} className="col mb-2" />
                <StatView name={t(makeKey('Construct.attribute.', Attribute[Attribute.Insight]))} value={character.attributes ? character.attributes[Attribute.Insight].value : undefined} className="col mb-2" />
                <StatView name={t(makeKey('Construct.attribute.', Attribute[Attribute.Reason]))} value={character.attributes ? character.attributes[Attribute.Reason].value : undefined} className="col mb-2" />
            </div>

            <Header level={2} className="mt-4">{t('Construct.other.disciplines')}</Header>
            <div className="row row-cols-1 row-cols-md-3 mt-3">
                <StatView name={t(makeKey('Construct.discipline.', Skill[Skill.Command]))} value={character.skills ? character.skills[Skill.Command].expertise : undefined} className="col mb-2" showZero={true} />
                <StatView name={t(makeKey('Construct.discipline.', Skill[Skill.Security]))} value={character.skills ? character.skills[Skill.Security].expertise : undefined} className="col mb-2" showZero={true} />
                <StatView name={t(makeKey('Construct.discipline.', Skill[Skill.Science]))} value={character.skills ? character.skills[Skill.Science].expertise : undefined} className="col mb-2" showZero={true} />
                <StatView name={t(makeKey('Construct.discipline.', Skill[Skill.Conn]))} value={character.skills ? character.skills[Skill.Conn].expertise : undefined} className="col mb-2" showZero={true} />
                <StatView name={t(makeKey('Construct.discipline.', Skill[Skill.Engineering]))} value={character.skills ? character.skills[Skill.Engineering].expertise : undefined} className="col mb-2" showZero={true} />
                <StatView name={t(makeKey('Construct.discipline.', Skill[Skill.Medicine]))} value={character.skills ? character.skills[Skill.Medicine].expertise : undefined} className="col mb-2" showZero={true} />
            </div>

        </>)
    }

    renderStress() {
        let stress = this.props.character.stress;
        if (stress) {
            let iterator = [];
            for (let i = 1; i <= Math.max(20, Math.ceil(stress / 5) * 5); i++) {
                iterator.push(i);
            }

            const pills = iterator.map(i => {
                if (i <= stress) {
                    return (<div className="empty-pill mb-2" key={'stress-' + i}></div>);
                } else {
                    return (<div className="empty-pill solid mb-2" key={'stress-' + i}></div>);
                }
            });
            return (<div className="d-flex flex-wrap mt-3 mb-2">
                    {pills}
                </div>);
        } else {
            return undefined;
        }
    }

    renderFocuses() {
        if (this.props.character.focuses) {
            return this.props.character.focuses.map((f, i) => (<div className="text-white view-border-bottom py-2" key={'focus-' + i}>{f}</div>));
        } else {
            return undefined;
        }
    }

    renderWeapons() {
        const { t, character } = this.props;
        if (character.determineWeapons().length) {
            let weapons = character.determineWeapons().map((w, i) => {
                let dice = w.dice;
                dice += character.skills[Skill.Security].expertise;
                return (<WeaponView key={'weapon-' + i} weapon={w} dice={dice} />);
            });
            return (<>
                    <Header level={2} className="mt-4">{t('Construct.other.weapons')}</Header>
                    <div>{weapons}</div>
                </>);
        } else {
            return null;
        }
    }


    renderTalents() {
        const { t } = this.props;
        if (this.props.character?.getTalentNameList()?.length) {
            return (<>
                <Header level={2} className="mt-4">{t('Construct.other.talents')}</Header>
                {this.props.character.getTalentNameList().map((t, i) => (<div className="text-white view-border-bottom py-2" key={'talent-' + i}>{t}</div>))}
                </>);
        } else {
            return undefined;
        }
    }

    renderValues() {
        const { t } = this.props;
        if (this.props?.character?.values?.length) {
            return (<>
                <Header level={2} className="mt-4">{t('Construct.other.values')}</Header>
                {this.props.character.values.map((v, i) => (<div className="text-white view-border-bottom py-2" key={'value-' + i}>{v}</div>))}
                </>);
        } else {
            return undefined;
        }
    }

    showVttExportDialog() {
        VttSelectionDialog.instance.show(this.props.character);
    }
}
