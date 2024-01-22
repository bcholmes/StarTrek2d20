import React from 'react';
import { createRoot } from 'react-dom/client';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from 'react-i18next';


interface IDialogProperties {
    message: string;
}

const _Dialog: React.FC<IDialogProperties> = ({ message }) => {

    const { t } = useTranslation();

    return (
        <Modal show={true}>
            <Modal.Body className="text-center py-4">{message}</Modal.Body>
            <Modal.Footer className="border-top-0 justify-content-center py-4">
                <Button variant="primary" onClick={() => Dialog.hide()}>
                    {t('Common.button.ok')}
                </Button>
            </Modal.Footer>
        </Modal>
    );
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
        if (visible) {
            DialogControl.root.render(
                React.createElement(_Dialog, {
                    message: this._message
                })
            );
        } else {
            DialogControl.root.unmount();
            DialogControl._root = null;
        }
    }
}

export const Dialog = new DialogControl();