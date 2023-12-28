import { ICharacterPageProperties } from "../common/iCharacterPageProperties";
import { useTranslation } from "react-i18next";
import { Header } from "../components/header";
import { TalentsHelper } from "../helpers/talents";
import replaceDiceWithArrowhead from "../common/arrowhead";

const TalentsBlockView: React.FC<ICharacterPageProperties> = ({character}) => {

    const { t } = useTranslation();
    let talents = [];
    let names = [];
    character.talents.forEach(talent => {
        if (names.indexOf(talent.talent) < 0) {
            names.push(talent.talent);
            talents.push(TalentsHelper.getTalent(talent.talent));
        }
    })

    if (character?.getTalentNameList()?.length) {
        return (<>
            <Header level={2} className="mt-4">{t('Construct.other.talents')}</Header>
            {talents.map((t, i) =>
                (<div className="text-white view-border-bottom py-2" key={'talent-' + i}>
                    <strong>{t.localizedDisplayName + (t.maxRank > 1 ? " [x" + character.getRankForTalent(t.name) + "]" : "")}:</strong> {' '}
                    {replaceDiceWithArrowhead(t.description)}
                </div>))}
        </>);
    } else {
        return undefined;
    }
}

export default TalentsBlockView;