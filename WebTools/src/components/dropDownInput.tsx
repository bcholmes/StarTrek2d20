import * as React from 'react';

interface IDropDownInputProperties {
    items: any[];
    defaultValue: any;
    onChange: (index: number) => void;
}

export class DropDownInput extends React.Component<IDropDownInputProperties, {}> {
    constructor(props: IDropDownInputProperties) {
        super(props);
    }

    render() {
        const {items, defaultValue, onChange} = this.props;

        const options = items.map((item, i) => {
            return <option key={i} value={item}>{item}</option>
        });

        return (
            <select value={defaultValue} onChange={e => onChange((e.target as HTMLSelectElement).selectedIndex) }>
                {options}
            </select>
        );
    }
}