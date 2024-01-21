import React from 'react';
import packageJson from '../package.alias.json';

export class AppVersion extends React.Component<{}, {}> {

    render() {
        return (<div id="version" className="pe-3">v{packageJson.version}</div>);
    }
}

export default AppVersion;