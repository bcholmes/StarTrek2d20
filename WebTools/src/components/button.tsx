import React from 'react';

interface IButtonProperties {
    onClick: () => void;
    buttonType?: boolean;
    text?: string;
    className?: string;
    onMouseOver?: () => void;
    onMouseOut?: () => void;
    enabled?: boolean;
    children?: React.ReactNode;
    title?: string;
}

export class Button extends React.Component<IButtonProperties, {}> {
    render() {
        let className = this.props.className;
        if (this.props.buttonType) {
            if (className.indexOf("button-small") >= 0) {
                className = className.replace("button-small", "btn btn-primary btn-sm");
            }
        }

        return this.props.buttonType ? (
            <button type="button" className={(className ? className : "btn btn-primary")}
                onClick={() => this.props.onClick()}
                onMouseOver={() => { if (this.props.onMouseOver) { this.props.onMouseOver(); }}}
                onMouseOut={() => { if (this.props.onMouseOut) { this.props.onMouseOut(); }}}
                disabled={this.props.enabled != null && !this.props.enabled}
                title={this.props.title}>
                {this.props.text ? this.props.text : this.props.children}
            </button>
        )
        : (
            <div className={(this.props.className ? this.props.className : "btn btn-primary") + " button-title"} onClick={() => this.props.onClick()}
                onMouseOver={() => { if (this.props.onMouseOver) { this.props.onMouseOver(); }}}
                onMouseOut={() => { if (this.props.onMouseOut) { this.props.onMouseOut(); }}}
                role="button">
                {this.props.text ? this.props.text : this.props.children}
            </div>
        )
    }
}