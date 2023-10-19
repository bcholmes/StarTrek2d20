import * as React from 'react';
import {character} from '../common/character';
import { CharacterType } from '../common/characterType';
import {Window} from '../common/window';
import {TracksHelper} from '../helpers/tracks';
import {SkillsHelper, Skill} from '../helpers/skills';
import {Button} from './button';
import { Track } from '../helpers/trackEnum';

interface ITrackSelectionProperties {
    onSelection: (track: Track) => void;
    onCancel: () => void;
    enlisted?: boolean;
}

export class TrackSelection extends React.Component<ITrackSelectionProperties, {}> {

    render() {
        var tracks = TracksHelper.instance().getTracks(this.props.enlisted).map((t, i) => {
            const disciplines = t.majorDisciplines.map((d, i) => {
                if (character.enlisted && d === Skill.Command) return undefined;

                return <div key={'skill-' + i}>{SkillsHelper.getSkillName(d) }</div>;
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

        const title = this.props.enlisted || character.type === CharacterType.KlingonWarrior
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
