import { ICharacterPageProperties } from "../common/iCharacterPageProperties";
import { useTranslation } from "react-i18next";
import { Header } from "../components/header";

const TalentsBlockView: React.FC<ICharacterPageProperties> = ({character}) => {

    const { t } = useTranslation();
    if (character?.getTalentNameList()?.length) {
        return (<>
            <Header level={2} className="mt-4">{t('Construct.other.talents')}</Header>
            {character.getTalentNameList().map((t, i) => (<div className="text-white view-border-bottom py-2" key={'talent-' + i}>{t}</div>))}
        </>);
    } else {
        return undefined;
    }
}

export default TalentsBlockView;