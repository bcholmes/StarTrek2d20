import { ICharacterPageProperties } from "../common/iCharacterPageProperties";
import { useTranslation } from "react-i18next";
import { Header } from "../components/header";
import { TalentsHelper } from "../helpers/talents";
import replaceDiceWithArrowhead from "../common/arrowhead";

const TalentsBlockView: React.FC<ICharacterPageProperties> = ({character}) => {

    const { t } = useTranslation();
    if (character?.getDistinctTalentNameList()?.length) {
        return (<>
            <Header level={2} className="mt-4">{t('Construct.other.talents')}</Header>
            {character?.getDistinctTalentNameList().map((tName, i) => {
                let t = TalentsHelper.getTalent(tName);
                return (<div className="text-white view-border-bottom py-2" key={'talent-' + i}>
                    <strong>{t.localizedDisplayName + (t.maxRank > 1 ? " [x" + character.getRankForTalent(t.name) + "]" : "")}:</strong> {' '}
                    {replaceDiceWithArrowhead(t.localizedDescription)}
                </div>)
            })}
        </>);
    } else {
        return undefined;
    }
}

export default TalentsBlockView;