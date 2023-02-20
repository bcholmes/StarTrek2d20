import * as React from 'react';

interface IDropDownInputProperties {
    items: string[]|DropDownElement[];
    defaultValue: any;
    onChange: (index: number) => void;
}

export class DropDownElement {

    readonly name: string;
    readonly value: number|string;

    constructor(value: number|string, name: string) {
        this.value = value;
        this.name = name;
    }
}

export class DropDownInput extends React.Component<IDropDownInputProperties, {}> {
    render() {
        const {items, defaultValue, onChange} = this.props;

        const options = items.map((item, i) => {
            if (item instanceof DropDownElement) {
                let element = item as DropDownElement;
                return <option key={i} value={element.value}>{element.name}</option>
            } else {
                return <option key={i} value={item}>{item}</option>
            }
        });

        return (
            <select value={defaultValue} onChange={e => onChange((e.target as HTMLSelectElement).selectedIndex) }>
                {options}
            </select>
        );
    }
}