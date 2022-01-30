import * as React from 'react';

interface IInstructionTextProperties {
    text: string[];
    className?: string; 
}

export class InstructionText extends React.Component<IInstructionTextProperties, {}> {

    render() {
        return this.props.text.map((s, i) => {
            return (
                <div className={ this.props.className ? this.props.className : 'page-text'} key={'text-' + i}>{s}</div>
            );
        });
    }
}

export default InstructionText;