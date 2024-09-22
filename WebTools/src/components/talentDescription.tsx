import React from 'react';
import replaceDiceWithArrowhead from '../common/arrowhead';
import { CHALLENGE_DICE_NOTATION } from '../common/challengeDiceNotation';
import Markdown from 'react-markdown';
import { Header } from './header';

interface ITalentDescriptionProperties {
    name: string;
    description: string;
}

export class TalentDescription extends React.Component<ITalentDescriptionProperties, {}> {
    render() {
        if (this.props.description == null) {
            return undefined;
        } else {
            const desc = (this.props.description.indexOf(CHALLENGE_DICE_NOTATION) >= 0)
                ? <p>{replaceDiceWithArrowhead(this.props.description)}</p>
                : <Markdown>{this.props.description}</Markdown>;

            return (
                <div>
                    <Header level={3}>{this.props.name}</Header>
                    {desc}
                </div>
            );
        }
    }
}