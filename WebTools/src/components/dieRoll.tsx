import * as React from 'react';

interface IDieRollProperties {
    roll: number;
    index: number;
    isSelected?: boolean;
    onSelect: (index: number) => void;
}

export class DieRoll extends React.Component<IDieRollProperties, {}> {
    private _isSelected: boolean;

    constructor(props: IDieRollProperties) {
        super(props);

        this._isSelected = this.props.isSelected;
    }

    componentDidUpdate(prevProps: IDieRollProperties) {
        this._isSelected = this.props.isSelected;
    }

    render() {
        const className = this._isSelected ? "die die-selected" : "die";

        return (
            <div className={className} onClick={() => this.toggleSelection() }>
                {this.props.roll}
            </div>
        );
    }

    private toggleSelection() {
        this._isSelected = !this._isSelected;
        this.props.onSelect(this._isSelected ? this.props.index : -1);
        this.forceUpdate();
    }
}