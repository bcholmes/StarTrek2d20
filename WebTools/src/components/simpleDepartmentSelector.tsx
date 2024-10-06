import { useTranslation } from "react-i18next";
import { makeKey } from "../common/translationKey";
import { Skill, SkillsHelper } from "../helpers/skills"
import { CheckBox } from "./checkBox";

interface ISimpleDepartmentSelectorProperties {

    isChecked: (department: Skill) => boolean;
    onSelectDepartment: (department: Skill) => void;
}

export const SimpleDepartmentSelector: React.FC<ISimpleDepartmentSelectorProperties> = ({onSelectDepartment, isChecked}) => {

    const { t } = useTranslation();
    return (<table className="selection-list">
        <tbody>
            {SkillsHelper.getSkills().map((s, i) => {
                return (<tr key={i}>
                    <td className="selection-header-small">{t(makeKey("Construct.discipline.", Skill[s]))}</td>
                    <td className="text-end">
                        <CheckBox text="" value={s} isChecked={isChecked(s)} onChanged={(val) => onSelectDepartment(s)}/>
                    </td>
                </tr>);
            })}
        </tbody>
    </table>);
}