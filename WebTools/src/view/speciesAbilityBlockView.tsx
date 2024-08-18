import { useTranslation } from "react-i18next";
import { Header } from "../components/header";
import { TalentsHelper } from "../helpers/talents";
import replaceDiceWithArrowhead from "../common/arrowhead";
import { Stereotype } from "../common/construct";
import { Starship } from "../common/starship";
import { Character } from "../common/character";
import ReactMarkdown from "react-markdown";

interface ISpeciesAbilityPageProperties {
    character: Character;
}

const SpeciesAbilityBlockView: React.FC<ISpeciesAbilityPageProperties> = ({character}) => {

    const { t } = useTranslation();
    const renderSpeciesAbility = () => {
        return (<>
            <Header level={2} className="mt-4">{t('Construct.other.speciesAbility')}</Header>
            <div className="text-white view-border-bottom pt-2">
                <ReactMarkdown className="markdown-sm">
                    {"**" + character.speciesStep.ability.name + ":** " +
                    character.speciesStep.ability.description}
                </ReactMarkdown>
            </div>
        </>);
    }

    if (character?.version > 1 && character?.speciesStep?.ability != null) {
        return renderSpeciesAbility();
    } else {
        return undefined;
    }
}

export default SpeciesAbilityBlockView;