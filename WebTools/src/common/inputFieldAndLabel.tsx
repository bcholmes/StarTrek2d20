import React from "react";

interface IInputFieldAndLabelState {
    hasFocus: boolean;
    value: string;
}

interface IInputFieldAndLabelProperties {
    id: string,
    labelName: string,
    type?: string,
    value: string,
    max?: number,
    onChange: (value: string) => void
}

export class InputFieldAndLabel extends React.Component<IInputFieldAndLabelProperties, IInputFieldAndLabelState> {

    constructor(props) {
        super(props);
        this.state = {
            hasFocus: false,
            value: this.props.value ?? ''
        }
    }

    componentDidUpdate(previousProps: IInputFieldAndLabelProperties, previousState, snapshot) {
        if (this.props.value !== previousProps.value) {
            this.setState((state) => ({...state, value: this.props.value}));
        }
    }

    render() {
        let additionalProps = {};
        if (this.props.type === 'number' && this.props.max != null) {
            additionalProps = {
                max: this.props.max
            }
        }

        return (
            <div className="d-sm-flex align-items-stretch mt-2" style={{ maxWidth: "80%" }}>
                <label htmlFor={this.props.id} className="textinput-label">{this.props.labelName}</label>
                <input
                    className="mw-100"
                    id={this.props.id}
                    type={this.props.type ? this.props.type : "text"}
                    onChange={(ev) => {
                        if (!this.state.hasFocus) {
                            this.props.onChange(ev.target.value);
                        } else {
                            this.setState((state) => ({...state, value: ev.target.value}))
                        }
                    }}
                    onFocus={() => {this.setState((state) => ({...state, hasFocus: true}))}}
                    onBlur={(ev) => {
                        this.setState((state) => ({...state, hasFocus: false}));
                        this.props.onChange(ev.target.value);
                    }}
                    {...additionalProps}
                    value={this.state.value} />
            </div>);
    }
}