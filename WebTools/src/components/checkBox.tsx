import React from 'react';

interface ICheckBoxProperties {
    value: any;
    onChanged: (val: any) => void;
    isChecked: boolean;
    text?: string;
    disabled?: boolean;
}

export class CheckBox extends React.Component<ICheckBoxProperties, {}> {

    render() {
        const {value, onChanged, isChecked, text, disabled} = this.props;

        return (
            <div style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem'}}>
                <label>
                <input type="checkbox" value={value} onChange={e => onChanged(value) } checked={isChecked}
                    onClick={(e) => { e.stopPropagation(); }} disabled={disabled === true} />
                    <span className={disabled === true ? "checkbox-text disabled" : "checkbox-text"}>{text}</span>
                </label>
            </div>
        );
    }
}