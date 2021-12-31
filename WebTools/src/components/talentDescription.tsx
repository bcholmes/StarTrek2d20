import * as React from 'react';

interface ITalentDescriptionProperties {
    name: string;
    description: string;
}

export class TalentDescription extends React.Component<ITalentDescriptionProperties, {}> {
    render() {
        const desc = this.props.description
            ? <div className="talent-desc">{this.props.description}</div>
            : undefined;

        return (
            <div>
                <div style={{fontWeight: 'bold'}}>{this.props.name}</div>
                {desc}
            </div>
        );
    }
}