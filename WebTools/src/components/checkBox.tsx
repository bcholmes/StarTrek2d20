import * as React from 'react';

interface ICheckBoxProperties {
    value: any;
    onChanged: (val: any) => void;
    isChecked: boolean;
    text?: string;
}

export class CheckBox extends React.Component<ICheckBoxProperties, {}> {
    constructor(props: ICheckBoxProperties) {
        super(props);
    }

    render() {
        const {value, onChanged, isChecked, text} = this.props;

        return (
            <div>
                <input type="checkbox" value={value} onChange={e => onChanged(value) } checked={isChecked} />
                <span className="checkbox-text">{text}</span>
            </div>
        );
    }
}