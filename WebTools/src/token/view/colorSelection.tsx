import React from "react";
import { SimpleColor } from "../../common/colour";
import { NamedColor } from "../model/namedColour";

interface IColorProperties {
    colors: string[]|NamedColor[];
    onSelection: (color: string) => void;
}

class ColorSelection extends React.Component<IColorProperties, {}> {

    render() {
        const { colors } = this.props;

        const buttons = colors.map(c => {
            const color = (c instanceof NamedColor) ? (c as NamedColor).color : c;
            const dark = SimpleColor.from(color).isDark;
            const borderColor = dark ? "#666666" : color;
            const title = (c instanceof NamedColor) ? (c as NamedColor).name : "";
            return (<div className="rounded-circle"
                style={{backgroundColor: color, width: "40px", aspectRatio: "1", borderColor: borderColor, borderWidth: "2px", borderStyle: "solid"}}
                key={'color-' + color.substring(1)}
                title={title}
                role="button"
                onClick={() => this.props.onSelection(color)}/>)
        });
        return (<div className="d-flex flex-wrap mt-3" style={{gap: "0.25rem"}}>
            {buttons}
        </div>);
    }

}

export default ColorSelection;