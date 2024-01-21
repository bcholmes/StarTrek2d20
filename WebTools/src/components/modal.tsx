import React from 'react';
import { createRoot } from 'react-dom/client';
import Modal from 'react-bootstrap/Modal';

interface IModalProperties {
    size?: "xl" | "lg" | "sm";
    show: boolean;
    onClose: () => void;
    children?: React.ReactNode;
    header: string;
}

const ModalBox: React.FC<IModalProperties> = ({size, show, onClose, children, header}) => {

    return (
        <Modal show={show} size={size}>
            <Modal.Header className="pt-4 border-bottom-0">
                <h5>{header}</h5>
                <button className="close" onClick={() => onClose() } role="button"><img src="static/img/close.png" style={{height: '24px', width: '24px'}} alt="Close" /></button>
            </Modal.Header>
            <Modal.Body>{children}</Modal.Body>
        </Modal>);
}

export default ModalBox;

class ModalDialogControl {

    static _root;

    size?: "xl" | "lg" | "sm";
    onClose?: () => void;
    children?: React.ReactNode;
    header: string;

    static get root() {
        if (ModalDialogControl._root == null) {
            ModalDialogControl._root = createRoot(document.getElementById("dialog"));
        }
        return ModalDialogControl._root;
    }

    show(size?: "xl" | "lg" | "sm", onClose?: () => void, children?: React.ReactNode, header?: string) {
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
        if (visible) {
            ModalDialogControl.root.render(
                React.createElement(ModalBox, {
                    show: visible,
                    onClose: () => { ModalControl.hide(); if (this.onClose) this.onClose();  },
                    size: this.size,
                    children: this.children,
                    header: this.header
                })
            );
        } else {
            ModalDialogControl.root.unmount();
            ModalDialogControl._root = null;
        }
    }
}
export const ModalControl = new ModalDialogControl();