import * as React from 'react';

interface IButtonProperties {
    onClick: () => void;
    buttonType?: boolean;
    text: string;
    className?: string;
}

export class Button extends React.Component<IButtonProperties, {}> {
    render() {
        return this.props.buttonType ? (
            <button type="button" className={(this.props.className ? this.props.className : "button") + " button-title"} onClick={() => this.props.onClick()}>
                {this.props.text}
            </button>
        )
        : (
            <div className={(this.props.className ? this.props.className : "button") + " button-title"} onClick={() => this.props.onClick()}>
                {this.props.text}
            </div>
        )
    }
}