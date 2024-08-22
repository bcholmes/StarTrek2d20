import { useTranslation } from "react-i18next";
import { ICharacterPageProperties } from "../common/iCharacterPageProperties";

export const DisciplinesOrDepartments: React.FC<ICharacterPageProperties> = ({character}) => {
    const { t } = useTranslation();
    return (<>{character.version > 1 ? t('Construct.other.departments') : t('Construct.other.disciplines')}</>)
}