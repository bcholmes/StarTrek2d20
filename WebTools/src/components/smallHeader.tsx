import * as React from 'react';

export class SmallHeader extends React.Component<{}, {}> {

    render() {
        return (<h5 className="header-small">{this.props.children}</h5>);
    }
}