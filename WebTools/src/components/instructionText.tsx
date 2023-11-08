import React from 'react';

interface IInstructionTextProperties {
    text: string[]|string;
    className?: string;
}

export class InstructionText extends React.Component<IInstructionTextProperties, {}> {

    render() {
        let text = this.props.text;
        if (typeof text === 'string') {
            text = text.split('\n');
        }
        return text.filter(t  => t?.length > 0).map((s, i) => {
            return (
                <p className={ this.props.className ? this.props.className : ''} key={'text-' + i}>{s}</p>
            );
        });
    }
}

export default InstructionText;