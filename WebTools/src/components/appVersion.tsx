import * as React from 'react';

export class AppVersion extends React.Component<{}, {}> {

    render() {
        return (<div id="version">v{process.env.REACT_APP_VERSION}</div>);
    }
}

export default AppVersion;