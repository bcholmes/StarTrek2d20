import * as React from 'react';

interface IHeaderProperties {
    text: string,
    className?: string
}
export class Header extends React.Component<IHeaderProperties, {}> {

    render() {
        return (<div className={'header-text ' + (this.props.className || '')}><div>{this.props.text}</div></div>)
    }
}