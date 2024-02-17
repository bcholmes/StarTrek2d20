import React from 'react';

interface IButtonProperties {
    onClick: () => void;
    className?: string;
    onMouseOver?: () => void;
    onMouseOut?: () => void;
    enabled?: boolean;
    children?: React.ReactNode;
    title?: string;
}

export class Button extends React.Component<IButtonProperties, {}> {
    render() {
        let className = this.props.className ?? "";
        if (className.indexOf("button-small") >= 0) {
            className = className.replace("button-small", "btn btn-primary btn-sm");
        } else if (className.indexOf("button-next") >= 0) {
            className = className.replace("button-next", "btn btn-primary");
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