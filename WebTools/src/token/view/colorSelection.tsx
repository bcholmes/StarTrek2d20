import React from "react";
import { Color } from "../../common/colour";

interface IColorProperties {
    colors: string[];
    onSelection: (color: string) => void;
}

class ColorSelection extends React.Component<IColorProperties, {}> {

    render() {
        const { colors } = this.props;

        const buttons = colors.map(c => {
            const dark = Color.from(c).isDark;
            const borderColor = dark ? "#666666" : c;
            return (<div className="rounded-circle"
                style={{backgroundColor: c, width: "40px", aspectRatio: "1", borderColor: borderColor, borderWidth: "2px", borderStyle: "solid"}}
                key={'color-' + c.substring(1)}
                role="button"
                onClick={() => this.props.onSelection(c)}/>)
        });
        return (<div className="d-flex flex-wrap mt-3" style={{gap: "0.25rem"}}>
            {buttons}
        </div>);
    }

}

export default ColorSelection;