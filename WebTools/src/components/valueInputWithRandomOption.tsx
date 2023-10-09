import { useTranslation } from "react-i18next";
import { InputFieldAndLabel } from "../common/inputFieldAndLabel";
import D20IconButton from "../solo/component/d20IconButton";

export interface IValueInput {
    value?: string;
    id?: string;
    textDescription?: string;
    onValueChanged: (string) => void;
    onRandomClicked: () => void;
}

const ValueInput: React.FC<IValueInput> = ({textDescription, id, value, onValueChanged, onRandomClicked}) => {
    const { t } = useTranslation();

    return (<>
        <div className="d-flex justify-content-between align-items-center flex-wrap">
            <InputFieldAndLabel labelName={t('Construct.other.value')} id={id ?? "value"} value={value ?? ""}
                onChange={(value) => onValueChanged(value) } />
            <div style={{ flexShrink: 0 }} className="mt-2">
                <D20IconButton onClick={() => onRandomClicked() }/>
            </div>
        </div>
        <div className="py-1 text-white">{textDescription}</div>
    </>)
}

export default ValueInput;