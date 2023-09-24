import React from "react";

interface IDataValueRowProperties {
    name: string;
    children?: React.ReactNode;
}

export const DataValueRow: React.FC<IDataValueRowProperties> = ({name, children}) => {

    return (<div className="row">
        <div className="col-md-4 view-field-label pb-2">{name}</div>
        <div className="col-md-8 text-white mb-3">
            <div className="view-border-bottom pb-2">
                {children}
            </div>
        </div>
    </div>);
}