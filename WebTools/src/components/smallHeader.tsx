import * as React from 'react';

interface ISmallHeaderProperties {
    children: React.ReactNode;
}

export const SmallHeader: React.FC<ISmallHeaderProperties> = ({children}) => {
    return (<h5 className="header-small">{children}</h5>);
}