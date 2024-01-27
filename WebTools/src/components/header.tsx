import React from 'react';

interface IHeaderProperties {
    className?: string;
    level?: 1|2|3;
    children: React.ReactNode;
}
export const Header: React.FC<IHeaderProperties> = ({className, level, children}) => {

    if (level == null || level === 1) {
        return (<h1 className={'header-text ' + (className || '')}><div>{children}</div></h1>);
    } else if (level === 2) {
        return (<h2 className={'header-text ' + (className || '')}><div>{children}</div></h2>);
    } else if (level === 3) {
        return (<h3 className={(className || '')}><div>{children}</div></h3>);
    } else {
        return null;
    }
}