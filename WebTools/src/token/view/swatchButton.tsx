import React from "react";

interface ISwatchButtonProperties {
    svg: string;
    title: string;
    onClick: () => void;
    active?: boolean;
    size?: string;
}

class SwatchButton extends React.Component<ISwatchButtonProperties, {}> {

    render() {
        const { svg, title, onClick, active, size } = this.props;
        let width = "75px";
        if (size === "lg") {
            width = "125px";
        }
        return (<button className={'btn btn-light btn-swatch rounded-circle' + (active ? ' active' : '')} style={{ width: width, aspectRatio: "1" }} title={title}
            onClick={() => onClick()}
            dangerouslySetInnerHTML={{__html: svg}}></button>)
    }
}

export default SwatchButton;