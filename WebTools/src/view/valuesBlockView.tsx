import { useTranslation } from "react-i18next";
import { ICharacterPageProperties } from "../common/iCharacterPageProperties";
import { Header } from "../components/header";

const ValuesBlockView: React.FC<ICharacterPageProperties> = ({character}) => {

    const { t } = useTranslation();
    if (character?.values?.length) {
        return (<>
            <Header level={2} className="mt-4">{t('Construct.other.values')}</Header>
            {character.values.map((v, i) => (<div className="text-white view-border-bottom py-2" key={'value-' + i}>{v}</div>))}
        </>);
    } else {
        return undefined;
    }

}

export default ValuesBlockView;