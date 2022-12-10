import React from "react";

interface IStatViewProperties {
    name: string;
    value?: number;
    className?: string;
    colourClass?: string;
    showZero?: boolean;
}

export class StatView extends React.Component<IStatViewProperties, {}> {

    render() {
        let value = (this.props.value || this.props.showZero)
            ? (<div className={'stat-value ' + (this.props.colourClass ? this.props.colourClass : 'purple')}>{this.props.value ? this.props.value : "0"}</div>)
            : (<div className={'stat-value ' + (this.props.colourClass ? this.props.colourClass : 'purple')}>&nbsp;</div>);

        return (<div className={this.props.className}>
            <div className={'stat-name ' + (this.props.colourClass ? this.props.colourClass : 'purple')}>{this.props.name}</div>
            {value}
        </div>);
    }
}