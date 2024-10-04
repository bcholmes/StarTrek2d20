import { useTranslation } from "react-i18next";
import { makeKey } from "../common/translationKey";
import { Attribute, AttributesHelper } from "../helpers/attributes"
import { CheckBox } from "./checkBox";

interface ISimpleAttributeSelectorProperties {

    isChecked: (attribute: Attribute) => boolean;
    onSelectAttribute: (attribute:Attribute) => void;
}

export const SimpleAttributeSelector: React.FC<ISimpleAttributeSelectorProperties> = ({onSelectAttribute, isChecked}) => {

    const { t } = useTranslation();
    return (<table className="selection-list">
        <tbody>
            {AttributesHelper.getAllAttributes().map((a, i) => {
                return (<tr key={i}>
                    <td className="selection-header-small">{t(makeKey("Construct.attribute.", Attribute[a]))}</td>
                    <td className="text-end">
                        <CheckBox text="" value={a} isChecked={isChecked(a)} onChanged={(val) => onSelectAttribute(a)}/>
                    </td>
                </tr>);
            })}
        </tbody>
    </table>);
}