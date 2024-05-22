import React, { useState } from 'react';

interface ISelectablePillProperties {
    name: string
    onClick: (active: boolean) => void;
}

export const SelectablePill: React.FC<ISelectablePillProperties> = ({name, onClick}) => {

    let [active, setActive] = useState(false);

    return (<button className={"selectable-pill me-1 px-3 py-1" + (active ? " active" : "")}
        onClick={() => {
            setActive(!active);
            onClick(!active);
        }}>{name}</button>);
}