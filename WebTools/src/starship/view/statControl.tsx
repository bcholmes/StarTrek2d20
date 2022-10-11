import React from "react";

interface IStatControlProperties {
    statName: string;
    value: number;
    showIncrease: boolean;
    showDecrease: boolean;
    onIncrease: () => void;
    onDecrease: () => void;
}

export class StatControl extends React.Component<IStatControlProperties, {}> {
    render() {
        const {statName, value, showDecrease, showIncrease} = this.props;

        const dec = showDecrease
            ? (<img style={{ float: "left" }} height="20" src="static/img/dec.png" onClick={ () => { this.props.onDecrease() } } alt="-"/>)
            : undefined;

        const inc = showIncrease
            ? (<img style={{ float: "right" }} height="20" src="static/img/inc.png" onClick={ () => { this.props.onIncrease() } } alt="+"/>)
            : undefined;

        return (
            <div className="stat">
                <div className="stat-entry-name">
                    {statName}
                </div>
                <div className="stat-entry-value">
                    {dec}
                    {value}
                    {inc}
                </div>
            </div>
        );
    }
}

