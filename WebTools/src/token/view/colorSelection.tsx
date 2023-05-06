import React from "react";

interface IColorProperties {
    colors: string[];
    onSelection: (color: string) => void;
}

class ColorSelection extends React.Component<IColorProperties, {}> {

    render() {
        const { colors } = this.props;

        const buttons = colors.map(c => (<div className="rounded-circle"
            style={{backgroundColor: c, width: "40px", aspectRatio: "1"}}
            key={'color-' + c.substring(1)}
            role="button"
            onClick={() => this.props.onSelection(c)}/>));
        return (<div className="d-flex mt-3" style={{gap: "0.25rem"}}>
            {buttons}
        </div>);
    }

}

export default ColorSelection;