import { useTranslation } from "react-i18next";
import { Header } from "../components/header";
import { StatView } from "../components/StatView";
import { makeKey } from "../common/translationKey";
import { Attribute } from "../helpers/attributes";
import { Skill } from "../helpers/skills";
import { ICharacterPageProperties } from "../common/iCharacterPageProperties";
import { DisciplinesOrDepartments } from "./disciplinesOrDepartments";

const CharacterStatBlock: React.FC<ICharacterPageProperties> = ({character}) => {

    const { t } = useTranslation();

    if (character.version === 1) {
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

            <Header level={2} className="mt-4"><DisciplinesOrDepartments character={character} /></Header>
            <div className="row row-cols-1 row-cols-md-3 mt-3">
                <StatView name={t(makeKey('Construct.discipline.', Skill[Skill.Command]))} value={character.departments ? character.departments[Skill.Command] : undefined} className="col mb-2" showZero={true} />
                <StatView name={t(makeKey('Construct.discipline.', Skill[Skill.Security]))} value={character.departments ? character.departments[Skill.Security] : undefined} className="col mb-2" showZero={true} />
                <StatView name={t(makeKey('Construct.discipline.', Skill[Skill.Science]))} value={character.departments ? character.departments[Skill.Science] : undefined} className="col mb-2" showZero={true} />
                <StatView name={t(makeKey('Construct.discipline.', Skill[Skill.Conn]))} value={character.departments ? character.departments[Skill.Conn] : undefined} className="col mb-2" showZero={true} />
                <StatView name={t(makeKey('Construct.discipline.', Skill[Skill.Engineering]))} value={character.departments ? character.departments[Skill.Engineering] : undefined} className="col mb-2" showZero={true} />
                <StatView name={t(makeKey('Construct.discipline.', Skill[Skill.Medicine]))} value={character.departments ? character.departments[Skill.Medicine] : undefined} className="col mb-2" showZero={true} />
            </div>

        </>);
    } else {
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

            <Header level={2} className="mt-4"><DisciplinesOrDepartments character={character} /></Header>
            <div className="row row-cols-1 row-cols-md-3 mt-3">
                <StatView name={t(makeKey('Construct.discipline.', Skill[Skill.Command]))} value={character.departments ? character.departments[Skill.Command] : undefined} className="col mb-2" showZero={true} />
                <StatView name={t(makeKey('Construct.discipline.', Skill[Skill.Engineering]))} value={character.departments ? character.departments[Skill.Engineering] : undefined} className="col mb-2" showZero={true} />
                <StatView name={t(makeKey('Construct.discipline.', Skill[Skill.Medicine]))} value={character.departments ? character.departments[Skill.Medicine] : undefined} className="col mb-2" showZero={true} />
                <StatView name={t(makeKey('Construct.discipline.', Skill[Skill.Conn]))} value={character.departments ? character.departments[Skill.Conn] : undefined} className="col mb-2" showZero={true} />
                <StatView name={t(makeKey('Construct.discipline.', Skill[Skill.Security]))} value={character.departments ? character.departments[Skill.Security] : undefined} className="col mb-2" showZero={true} />
                <StatView name={t(makeKey('Construct.discipline.', Skill[Skill.Science]))} value={character.departments ? character.departments[Skill.Science] : undefined} className="col mb-2" showZero={true} />
            </div>

        </>);
    }

}

export default CharacterStatBlock;