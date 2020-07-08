import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Button} from './button';

interface IDialogProperties {
    message: string;
    isVisible: boolean;
}

class _Dialog extends React.Component<IDialogProperties, {}> {
    constructor(props: IDialogProperties) {
        super(props);
    }

    render() {
        const {message, isVisible} = this.props;

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
    private _message: string;

    show(message: string) {
        this._message = message;
        this.render(true);
    }

    hide() {
        this.render(false);
    }

    private render(visible: boolean) {
        ReactDOM.render(
            React.createElement(_Dialog, {
                message: this._message,
                isVisible: visible
            }),
            document.getElementById("dialog")
        );
    }
}

export const Dialog = new DialogControl();