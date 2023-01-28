import * as React from 'react';
import { character } from '../common/character';
import {Window} from '../common/window';
import { Career } from '../helpers/careerEnum';
import {CareersHelper} from '../helpers/careers';
import { ADVANCED_TEAM_DYNAMICS } from '../helpers/talents';
import {Button} from './button';

interface ICareerSelectionProperties {
    onSelection: (career: Career) => void;
    onCancel: () => void;
}

export class CareerSelection extends React.Component<ICareerSelectionProperties, {}> {
    render() {

        let message = (character.hasTalent(ADVANCED_TEAM_DYNAMICS)) ? (<div className="page-text">Your character has a Talent ("{ADVANCED_TEAM_DYNAMICS}") that precludes Young characters</div>) : undefined;

        var careers = CareersHelper.instance.getCareers().map((c, i) => {
            const talent = c.talent.length === 1
                ? c.talent[0].name
                : "One talent of choice";

            return (
                <tr key={i}
                    onClick={() => { if (Window.isCompact()) this.props.onSelection(c.id); } }>
                    <td className="selection-header">{c.name}</td>
                    <td>{talent}</td>
                    <td><Button className="button-small" text="Select" onClick={() => { this.props.onSelection(c.id) } } /></td>
                </tr>
            )
        });

        return (
            <div>
                <div className="header-text"><div>SELECT CAREER</div></div>
                {message}
                <table className="selection-list">
                    <thead>
                        <tr>
                            <td></td>
                            <td><b>Talent</b></td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {careers}
                    </tbody>
                </table>
                <Button text="Cancel" className="button button-cancel" onClick={() => this.props.onCancel() }/>
            </div>
        );
    }
}