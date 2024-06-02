import { useTranslation } from "react-i18next";
import { Header } from "../components/header";
import { TalentsHelper } from "../helpers/talents";
import replaceDiceWithArrowhead from "../common/arrowhead";
import { Stereotype } from "../common/construct";
import { Starship } from "../common/starship";
import { Character } from "../common/character";

interface IConstructPageProperties {
    construct: Character|Starship;
}

const TalentsBlockView: React.FC<IConstructPageProperties> = ({construct}) => {

    const renderStarshipTalents = () => {

        const talents = construct?.getDistinctTalentNameList().map((tName, i) => {
            let t = TalentsHelper.getTalent(tName);
            if (t.specialRule) {
                return null;
            } else if (construct.stereotype === Stereotype.SoloStarship) {
                return (<div className="text-white view-border-bottom py-2" key={'talent-' + i}>
                    <strong>{t.localizedDisplayName + (t.maxRank > 1 ? " [x" + construct.getRankForTalent(t.name) + "]" : "")}:</strong> {' '}
                    {replaceDiceWithArrowhead(t.localizedSoloDescription)}
                </div>);
            } else {
                let name = t.localizedDisplayName;
                let starship = construct as Starship;
                let qualifier = starship.getQualifierForTalent(tName);
                if (qualifier?.length) {
                    name += " [" + qualifier + "]";
                }
                return (<div className="text-white view-border-bottom py-2" key={'talent-' + i}>
                    <strong>{name + (t.maxRank > 1 ? " [x" + construct.getRankForTalent(t.name) + "]" : "")}:</strong> {' '}
                    {replaceDiceWithArrowhead(t.localizedDescription)}
                </div>);
            }
        });

        const specialRules = construct?.getDistinctTalentNameList().map((tName, i) => {
            let t = TalentsHelper.getTalent(tName);
            if (!t.specialRule) {
                return null;
            } else if (construct.stereotype === Stereotype.SoloStarship) {
                return (<div className="text-white view-border-bottom py-2" key={'talent-' + i}>
                    <strong>{t.localizedDisplayName + (t.maxRank > 1 ? " [x" + construct.getRankForTalent(t.name) + "]" : "")}:</strong> {' '}
                    {replaceDiceWithArrowhead(t.localizedSoloDescription)}
                </div>);
            } else {
                let name = t.localizedDisplayName;
                let starship = construct as Starship;
                let qualifier = starship.getQualifierForTalent(tName);
                if (qualifier?.length) {
                    name += " [" + qualifier + "]";
                }
                return (<div className="text-white view-border-bottom py-2" key={'talent-' + i}>
                    <strong>{name + (t.maxRank > 1 ? " [x" + construct.getRankForTalent(t.name) + "]" : "")}:</strong> {' '}
                    {replaceDiceWithArrowhead(t.localizedDescription)}
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
                return (<div className="text-white view-border-bottom py-2" key={'talent-' + i}>
                    <strong>{t.localizedDisplayName + (t.maxRank > 1 ? " [x" + construct.getRankForTalent(t.name) + "]" : "")}:</strong> {' '}
                    {replaceDiceWithArrowhead(t.localizedDescription)}
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