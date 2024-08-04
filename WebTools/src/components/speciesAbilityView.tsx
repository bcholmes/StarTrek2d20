import ReactMarkdown from "react-markdown";
import { Character } from "../common/character";
import { Header } from "./header";
import { useTranslation } from "react-i18next";

interface ISpeciesAbilityProperties{
    character: Character;
}

export const SpeciesAbilityView: React.FC<ISpeciesAbilityProperties> = ({character}) => {

    const { t } = useTranslation()

    if (character?.speciesStep?.ability) {
        return (<>
            <Header level={2}>{t('Construct.other.speciesAbility')}</Header>
            <ReactMarkdown>{t('SpeciesAbilityView.instruction')}</ReactMarkdown>

            <Header level={3}>{character.speciesStep?.ability?.name}</Header>
            <ReactMarkdown>{character.speciesStep?.ability?.description}</ReactMarkdown>
        </>);
    } else {
        return undefined;
    }
}