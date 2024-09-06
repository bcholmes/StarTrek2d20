import { useTranslation } from "react-i18next";
import { Header } from "../components/header";
import { TalentModel, TalentsHelper } from "../helpers/talents";
import replaceDiceWithArrowhead from "../common/arrowhead";
import { Stereotype } from "../common/construct";
import { Starship } from "../common/starship";
import { Character } from "../common/character";
import { CHALLENGE_DICE_NOTATION } from "../common/challengeDiceNotation";
import ReactMarkdown from "react-markdown";

interface IConstructPageProperties {
    construct: Character|Starship;
}

const TalentsBlockView: React.FC<IConstructPageProperties> = ({construct}) => {

    const renderDescription = (talentName: string, talent: TalentModel) => {
        let description = construct.version === 1 ? talent.localizedDescription : talent.localizedDescription2e;
        if (description.indexOf(CHALLENGE_DICE_NOTATION) >= 0) {
            return replaceDiceWithArrowhead(description);
        } else {
            return (<ReactMarkdown className="markdown-sm">{'**' + talentName + ':** ' + description}</ReactMarkdown>)
        }
    }

    const renderStarshipTalents = () => {

        const talents = construct?.getDistinctTalentNameList().map((tName, i) => {
            let t = TalentsHelper.getTalent(tName);
            let name = t.localizedDisplayName;
            let starship = construct as Starship;
            let qualifier = starship.getQualifierForTalent(tName);
            if (qualifier?.length) {
                name += " [" + qualifier + "]";
            }
            let talentName = name + (t.maxRank > 1 ? " [x" + construct.getRankForTalent(t.name) + "]" : "");
            if (t.specialRule) {
                return null;
            } else if (construct.stereotype === Stereotype.SoloStarship) {
                return (<div className="text-white view-border-bottom py-2" key={'talent-' + i}>
                    <strong>{t.localizedDisplayName + (t.maxRank > 1 ? " [x" + construct.getRankForTalent(t.name) + "]" : "")}:</strong> {' '}
                    {replaceDiceWithArrowhead(t.localizedSoloDescription)}
                </div>);
            } else {
                return (<div className="text-white view-border-bottom py-2" key={'talent-' + i}>
                    {renderDescription(talentName, t)}
                </div>);
            }
        });

        const specialRules = construct?.getDistinctTalentNameList().map((tName, i) => {
            let t = TalentsHelper.getTalent(tName);
            let name = t.localizedDisplayName;
            let starship = construct as Starship;
            let qualifier = starship.getQualifierForTalent(tName);
            if (qualifier?.length) {
                name += " [" + qualifier + "]";
            }
            let talentName = name + (t.maxRank > 1 ? " [x" + construct.getRankForTalent(t.name) + "]" : "");
            if (!t.specialRule) {
                return null;
            } else if (construct.stereotype === Stereotype.SoloStarship) {
                return (<div className="text-white view-border-bottom py-2" key={'talent-' + i}>
                    <strong>{t.localizedDisplayName + (t.maxRank > 1 ? " [x" + construct.getRankForTalent(t.name) + "]" : "")}:</strong> {' '}
                    {replaceDiceWithArrowhead(t.localizedSoloDescription)}
                </div>);
            } else {
                return (<div className="text-white view-border-bottom py-2" key={'talent-' + i}>
                    {renderDescription(talentName, t)}
                </div>);
            }
        });

        return (<>

            {talents?.filter(s => s != null)?.length
                ? (<>
                    <Header level={2} className="mt-4">{t('Construct.other.talents')}</Header>
                    {talents}
                </>)
                : null
            }
            {specialRules?.filter(s => s != null)?.length
                ? (<>
                    <Header level={2} className="mt-4">{t('Construct.other.specialRules')}</Header>
                    {specialRules}
                </>)
                : null
            }
        </>)

    }

    const renderCharacterTalents = () => {
        return (<>
            <Header level={2} className="mt-4">{construct.stereotype === Stereotype.Npc ? t('Construct.other.specialRules') : t('Construct.other.talents')}</Header>
            {construct?.getDistinctTalentNameList().map((tName, i) => {
                let t = TalentsHelper.getTalent(tName);
                let talentName = t.localizedDisplayName + (t.maxRank > 1 ? " [x" + construct.getRankForTalent(t.name) + "]" : "");
                return (<div className="text-white view-border-bottom py-2" key={'talent-' + i}>
                    {renderDescription(talentName, t)}
                </div>);
            })}
        </>);
    }

    const { t } = useTranslation();
    if (construct?.getDistinctTalentNameList()?.length) {
        return construct instanceof Character ? renderCharacterTalents() : renderStarshipTalents();
    } else {
        return undefined;
    }
}

export default TalentsBlockView;