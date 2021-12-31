import * as React from 'react';

interface IAttributeProperties {
    name: string;
    value: number;
    points: number;
}

export class AttributeView extends React.Component<IAttributeProperties, {}> {

    render() {
        const {name, value, points} = this.props;

        return (
            <div>
                <div className="attribute-container">
                    {name}
                </div>
                <div className="attribute-value">
                    (+{points})&nbsp;
                    {value}
                </div>
            </div>
        );
    }
}