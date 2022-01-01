import * as React from 'react';

interface IModalProperties {
    size?: string,
    show: boolean;
    onClose?: () => void;
    children?: React.ReactNode;
}

class Modal extends React.Component<IModalProperties, {}> {

    render() {
        return (
            <div className={this.props.show ? "dialog-visible": "dialog-hidden" }>
                <div className="dialog-bg" onClick={() => { if (this.props.onClose) this.props.onClose() }}></div>
                <div className={'dialog-container dialog-container-visible ' + (this.props.size === 'lg' ? 'dialog-container-lg' : '')} style={{ textAlign: 'left' }}>
                    <button className="close" onClick={() => { if (this.props.onClose) this.props.onClose() } }><img src="static/img/close.png" style={{height: '24px', width: '24px'}} alt="Close" /></button>
                    {this.props.children}
                </div>
            </div>
        );
    }

}

export default Modal;