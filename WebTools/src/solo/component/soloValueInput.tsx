import { useTranslation } from "react-i18next";
import { InputFieldAndLabel } from "../../common/inputFieldAndLabel";

export interface ISoloValueInput {
    value?: string;
    id?: string;
    textDescription: string;
    onValueChanged: (string) => void;
}

const SoloValueInput: React.FC<ISoloValueInput> = ({textDescription, id, value, onValueChanged}) => {
    const { t } = useTranslation();

    return (<>
        <InputFieldAndLabel labelName={t('Construct.other.value')} id={id ?? "value"} value={value ?? ""} onChange={(value) => onValueChanged(value) } />
        <div className="text-white py-1">{textDescription}</div>
    </>)
    return undefined;
}

export default SoloValueInput;