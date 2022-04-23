import * as React from 'react';

interface IHeaderProperties {
    className?: string;
    level?: number;
}
export class Header extends React.Component<IHeaderProperties, {}> {

    render() {
        if (this.props.level == null || this.props.level === 1) {
            return (<h1 className={'header-text ' + (this.props.className || '')}><div>{this.props.children}</div></h1>);
        } else if (this.props.level === 2) {
            return (<h2 className={'header-text ' + (this.props.className || '')}><div>{this.props.children}</div></h2>);
        } else {
            return null;
        }
    }
}