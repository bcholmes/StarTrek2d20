import React from 'react';
import packageJson from '../package.alias.json';

export class AppVersion extends React.Component<{}, {}> {

    render() {
        return (<div id="version">v{packageJson.version}</div>);
    }
}

export default AppVersion;