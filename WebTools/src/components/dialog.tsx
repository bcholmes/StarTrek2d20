import React from 'react';
import { createRoot } from 'react-dom/client';
import {Button} from './button';

interface IDialogProperties {
    message: string;
    isVisible: boolean;
}


class _Dialog extends React.Component<IDialogProperties, {}> {
    render() {
        const {isVisible} = this.props;

        const visibilityClass = isVisible
            ? "dialog-visible"
            : "dialog-hidden";

        const containerClass = isVisible
            ? "dialog-container dialog-container-visible"
            : "dialog-container";

        return (
            <div className={visibilityClass}>
                <div className="dialog-bg"></div>
                <div className={containerClass}>
                    {this.props.message}
                    <br/>
                    <div className="button-container-centered">
                        <Button text="OK" className="button" onClick={() => { Dialog.hide() } } />
                    </div>
                </div>
            </div>
        );
    }
}

class DialogControl {
    static _root;

    private _message: string;

    static get root() {
        if (DialogControl._root == null) {
            DialogControl._root = createRoot(document.getElementById("dialog"));
        }
        return DialogControl._root;
    }

    show(message: string) {
        this._message = message;
        this.render(true);
    }

    hide() {
        this.render(false);
    }

    private render(visible: boolean) {
        DialogControl.root.render(
            React.createElement(_Dialog, {
                message: this._message,
                isVisible: visible
            })
        );
    }
}

export const Dialog = new DialogControl();