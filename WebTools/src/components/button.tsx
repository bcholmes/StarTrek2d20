import * as React from 'react';

interface IButtonProperties {
    onClick: () => void;
    buttonType?: boolean;
    text?: string;
    className?: string;
    onMouseOver?: () => void;
    onMouseOut?: () => void;
    enabled?: boolean;
    children?: React.ReactNode;
}

export class Button extends React.Component<IButtonProperties, {}> {
    render() {
        return this.props.buttonType ? (
            <button type="button" className={(this.props.className ? this.props.className : "button") + " button-title"}
                onClick={() => this.props.onClick()}
                onMouseOver={() => { if (this.props.onMouseOver) { this.props.onMouseOver(); }}}
                onMouseOut={() => { if (this.props.onMouseOut) { this.props.onMouseOut(); }}}
                disabled={this.props.enabled != null && !this.props.enabled} >
                {this.props.text ? this.props.text : this.props.children}
            </button>
        )
        : (
            <div className={(this.props.className ? this.props.className : "button") + " button-title"} onClick={() => this.props.onClick()}
                onMouseOver={() => { if (this.props.onMouseOver) { this.props.onMouseOver(); }}}
                onMouseOut={() => { if (this.props.onMouseOut) { this.props.onMouseOut(); }}}>
                {this.props.text ? this.props.text : this.props.children}
            </div>
        )
    }
}