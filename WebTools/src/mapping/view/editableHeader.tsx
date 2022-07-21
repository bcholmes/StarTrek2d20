import * as React from 'react';

interface IEditableHeaderProperties {
    prefix?: string
    text: string
    onChange?: (text: string) => void
}

interface IEditableHeaderState {
    editMode: boolean;
    editText: string;
}

export class EditableHeader extends React.Component<IEditableHeaderProperties, IEditableHeaderState> {

    constructor(props: IEditableHeaderProperties) {
        super(props);
        this.state = {
            editMode: false,
            editText: ''
        };
    }

    render() {
        return (<h1 className="header-text visible-on-hover">
                <div> 
                    <div  className="d-flex align-items-center">
                        <div>{this.props.prefix ? (this.props.prefix + ' • ') : ''}</div> {this.renderText()}
                    </div> 
                </div>
                <button type="button" className="btn btn-link py-0" onClick={() => this.toggleEditMode()}><i className="bi bi-pencil-fill"></i></button> 
            </h1>);
    }


    renderText() {
        if (this.state.editMode) {
            return (<input value={this.state.editText} type="text" style={{fontSize: '20px', lineHeight: '24px'}} 
                onChange={(e) => {this.setEditText(e.target.value)}}
                onKeyPress={(e) => {if (e.charCode === 13) this.toggleEditMode() }}
                onBlur={() => this.toggleEditMode()}
                autoFocus/>);
        } else {
            return (<div>{this.props.text}</div>);
        }
    }

    toggleEditMode() {
        let editMode = !this.state.editMode;
        if (editMode) {
            this.setState((state) => ({...state, editMode: !state.editMode, editText: this.props.text}));
        } else {
            if (this.props.onChange) {
                this.props.onChange(this.state.editText);
            }
            this.setState((state) => ({...state, editMode: !state.editMode}));
        }
    }

    setEditText(text: string) {
        this.setState((state) => ({...state, editText: text}));
    }
}