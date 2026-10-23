import React from 'react';
import { createRoot } from 'react-dom/client';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from 'react-i18next';

interface IDialogProperties {
  message: string;
}

const DialogContent: React.FC<IDialogProperties> = ({ message }) => {
  const { t } = useTranslation();

  return (
    <Modal show={true}>
      <Modal.Body
        className="text-center py-4"
        style={{ whiteSpace: 'pre-line' }}
      >
        {message}
      </Modal.Body>
      <Modal.Footer className="border-top-0 justify-content-center py-4">
        <Button variant="primary" onClick={() => Dialog.hide()}>
          {t('Common.button.ok')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

class DialogControl {
  static rootElement;

  private message: string;

  static get root() {
    if (DialogControl.rootElement == null) {
      DialogControl.rootElement = createRoot(document.getElementById('dialog'));
    }
    return DialogControl.rootElement;
  }

  show(message: string) {
    this.message = message;
    this.render(true);
  }

  hide() {
    this.render(false);
  }

  private render(visible: boolean) {
    if (visible) {
      DialogControl.root.render(
        React.createElement(DialogContent, {
          message: this.message,
        }),
      );
    } else {
      DialogControl.root.unmount();
      DialogControl.rootElement = null;
    }
  }
}

export const Dialog = new DialogControl();
