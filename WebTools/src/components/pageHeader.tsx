import * as React from 'react';

interface IPageHeaderProperties {
    text: string;
}

export class PageHeader extends React.Component<IPageHeaderProperties, {}> {
    constructor(props: IPageHeaderProperties) {
        super(props);
    }

    render() {
        return (
            <div className="header">
                <div className="header-title">{this.props.text}</div>
            </div>
        );
    }
}