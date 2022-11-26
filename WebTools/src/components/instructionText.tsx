import * as React from 'react';

interface IInstructionTextProperties {
    text: string[];
    className?: string;
}

export class InstructionText extends React.Component<IInstructionTextProperties, {}> {

    render() {
        return this.props.text.map((s, i) => {
            return (
                <p className={ this.props.className ? this.props.className : ''} key={'text-' + i}>{s}</p>
            );
        });
    }
}

export default InstructionText;