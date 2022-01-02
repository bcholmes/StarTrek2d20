import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface IModalProperties {
    size?: string;
    show: boolean;
    onClose: () => void;
    children?: React.ReactNode;
    header: string;
}

class Modal extends React.Component<IModalProperties, {}> {

    render() {
        return (
            <div className={this.props.show ? "dialog-visible": "dialog-hidden" }>
                <div className="modal-backdrop"></div>
                <div className="modal" onClick={() => { console.log('background action'); this.props.onClose(); } }>
                    <div className={'modal-dialog ' + (this.props.size === 'lg' ? 'modal-lg' : '')}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5>{this.props.header}</h5>
                                <button className="close" onClick={() => this.props.onClose() }><img src="static/img/close.png" style={{height: '24px', width: '24px'}} alt="Close" /></button>
                            </div>
                            <div className="modal-body">
                                {this.props.children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default Modal;

class ModalDialogControl {

    size?: string;
    onClose?: () => void;
    children?: React.ReactNode;
    header: string;

    show(size?: string, onClose?: () => void, children?: React.ReactNode, header?: string) {
        this.size = size;
        this.onClose = onClose;
        this.children = children;
        this.header = header ? header : 'Select';
        this.render(true);
    }

    hide() {
        this.render(false);
    }

    private render(visible: boolean) {
        ReactDOM.render(
            React.createElement(Modal, {
                show: visible,
                onClose: () => { console.log('click close'); ModalControl.hide(); if (this.onClose) this.onClose();  },
                size: this.size,
                children: this.children,
                header: this.header
            }),
            document.getElementById("dialog")
        );
    }
}
export const ModalControl = new ModalDialogControl();