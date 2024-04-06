import React from 'react';
import packageJson from '../../package.json';

export class AppVersion extends React.Component<{}, {}> {

    render() {
        return (<div id="version" className="px-3">v{packageJson.version}</div>);
    }
}

export default AppVersion;