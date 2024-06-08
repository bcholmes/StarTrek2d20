import React from 'react';

interface IButtonProperties {
    onClick: () => void;
    variant?: string;
    className?: string;
    onMouseOver?: () => void;
    onMouseOut?: () => void;
    enabled?: boolean;
    children?: React.ReactNode;
    title?: string;
}

export class Button extends React.Component<IButtonProperties, {}> {
    render() {
        let variant = this.props.variant;
        if (!variant) {
            variant = "primary";
        }

        let className = this.props.className ?? "";
        if (className.indexOf("btn-link") >= 0) {
            variant = undefined;
        } else if (className.indexOf("button-small") >= 0) {
            className = className.replace("button-small", "btn btn-" + variant + " btn-sm");
        } else if (className.indexOf("button-next") >= 0) {
            className = className.replace("button-next", "btn btn-" + variant + " btn-sm");
        } else if (className.indexOf("btn") < 0) {
            className = "btn btn-" + variant + " " + className;
        }

        if (variant != null && className.indexOf("btn-" + variant) < 0) {
            className += " btn-" + variant;
        }

        return (
            <button type="button" className={(className ? className : "btn btn-primary")}
                onClick={() => this.props.onClick()}
                onMouseOver={() => { if (this.props.onMouseOver) { this.props.onMouseOver(); }}}
                onMouseOut={() => { if (this.props.onMouseOut) { this.props.onMouseOut(); }}}
                disabled={this.props.enabled != null && !this.props.enabled}
                title={this.props.title}>
                {this.props.children}
            </button>
        );
    }
}