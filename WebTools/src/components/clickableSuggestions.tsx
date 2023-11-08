import React from 'react';

interface IClickableSuggestionsProperties {
    suggestions: string[];
    target: HTMLInputElement;
}

export class ClickableSuggestions extends React.Component<IClickableSuggestionsProperties, {}> {
    constructor(props: IClickableSuggestionsProperties) {
        super(props);
    }

    render() {
        const suggestions = this.props.suggestions.map((s, i) => {
            const separator = i === this.props.suggestions.length-1
                ? ""
                : ", ";

            return (
                <div key={i} className="suggestion" onClick={() => { this.selectSuggestion(s); }}>{s}{separator}</div>
            );
        });

        return (<div></div>);
    }

    private selectSuggestion(suggestion: string) {
        this.props.target.value = suggestion;
    }
}