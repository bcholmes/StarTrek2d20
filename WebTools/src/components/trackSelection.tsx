import * as React from 'react';
import {character, CharacterType} from '../common/character';
import {Window} from '../common/window';
import {Track, TracksHelper} from '../helpers/tracks';
import {AttributesHelper} from '../helpers/attributes';
import {SkillsHelper, Skill} from '../helpers/skills';
import {Button} from './button';

interface ITrackSelectionProperties {
    onSelection: (track: Track) => void;
    onCancel: () => void;
}

export class TrackSelection extends React.Component<ITrackSelectionProperties, {}> {
    constructor(props: ITrackSelectionProperties) {
        super(props);
    }

    render() {
        var tracks = TracksHelper.getTracks().map((t, i) => {
            const disciplines = t.majorDisciplines.map((d, i) => {
                if (character.enlisted && d === Skill.Command) return undefined;

                return <div>{SkillsHelper.getSkillName(d) }</div>;
            });

            return (
                <tr key={i}
                    onClick={() => { if (Window.isCompact()) this.props.onSelection(t.id); } }>
                    <td className="selection-header">{t.name}</td>
                    <td>{disciplines}</td>
                    <td><Button className="button-small" text="Select" onClick={() => { this.props.onSelection(t.id) } } /></td>
                </tr>
            )
        });

        const title = character.enlisted || character.type === CharacterType.KlingonWarrior
            ? "SELECT TRACK"
            : "SELECT ACADEMY TRACK";

        return (
            <div>
                <div className="header-text"><div>{title}</div></div>
                <table className="selection-list">
                    <thead>
                        <tr>
                            <td></td>
                            <td><b>Majors</b></td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {tracks}
                    </tbody>
                </table>
                <Button text="Cancel" className="button button-cancel" onClick={() => this.props.onCancel() }/>
            </div>
        );
    }
}
