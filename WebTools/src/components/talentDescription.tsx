import * as React from 'react';
import replaceDiceWithArrowhead from '../common/arrowhead';

interface ITalentDescriptionProperties {
    name: string;
    description: string;
}

export class TalentDescription extends React.Component<ITalentDescriptionProperties, {}> {
    render() {
        const desc = this.props.description
            ? <div className="text-white">{replaceDiceWithArrowhead(this.props.description)}</div>
            : undefined;

        return (
            <div>
                <div style={{fontWeight: 'bold'}} className="text-white">{this.props.name}</div>
                {desc}
            </div>
        );
    }
}