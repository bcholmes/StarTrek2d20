import React from "react";
import { Token } from "../model/token";

interface ISwatchButtonProperties {
    svg: string|((token: Token) => string);
    title: string;
    onClick: () => void;
    token: Token;
    active?: boolean;
    size?: string;
}

class SwatchButton extends React.Component<ISwatchButtonProperties, {}> {

    render() {
        const { svg, title, onClick, active, size, token } = this.props;
        let width = "75px";
        if (size === "lg") {
            width = "125px";
        }
        let svgContents = "";
        if (svg instanceof String || typeof svg === 'string') {
            svgContents = svg as string;
        } else {
            let s = svg as ((token: Token) => string);
            svgContents = s(token);
        }
        return (<button className={'btn btn-light btn-swatch rounded-circle' + (active ? ' active' : '')} style={{ width: width, aspectRatio: "1" }} title={title}
            onClick={() => onClick()}
            dangerouslySetInnerHTML={{__html: svgContents}}></button>)
    }
}

export default SwatchButton;