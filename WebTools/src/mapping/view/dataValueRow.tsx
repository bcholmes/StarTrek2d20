import React from "react";

interface IDataValueRowProperties {
    name: string;
}

export class DataValueRow extends React.Component<IDataValueRowProperties, {}> {

    render() {
        return (<div className="row">
            <div className="col-md-4 view-field-label pb-2">{this.props.name}</div>
            <div className="col-md-8 text-white">
                <div className="view-border-bottom pb-2">
                    {this.props.children}
                </div>
            </div>
        </div>);
    }
}