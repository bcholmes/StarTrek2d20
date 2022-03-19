import React from "react";

export class CharacterCreationBreadcrumbs extends React.Component<{},{}> {

    render() {
        return (<nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="index.html">Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Character Creation</li>
                    </ol>
                </nav>);
    }
} 