import * as React from 'react';

interface IButtonProperties {
    onClick: () => void;
    text: string;
    className: string;
}

export class Button extends React.Component<IButtonProperties, {}> {
    render() {
        return (
            <div className={this.props.className + " button-title"} onClick={() => this.props.onClick()}>
                {this.props.text}
            </div>
        );
    }
}