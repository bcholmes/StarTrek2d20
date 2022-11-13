import React from "react";

interface IInputFieldAndLabelProperties {
    id: string,
    labelName: string,
    type?: string,
    value: string,
    onChange: (value: string) => void
}

export class InputFieldAndLabel extends React.Component<IInputFieldAndLabelProperties, {}> {

    render() {
        return (
            <div className="d-sm-flex align-items-stretch mt-3">
                <label htmlFor={this.props.id} className="textinput-label">{this.props.labelName}</label>
                <input
                    id={this.props.id}
                    type={this.props.type ? this.props.type : "text"}
                    onChange={(ev) => this.props.onChange(ev.target.value) }
                    value={this.props.value} />
            </div>);
    }
}