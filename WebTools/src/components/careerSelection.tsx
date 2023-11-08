import React from 'react';
import { character } from '../common/character';
import {Window} from '../common/window';
import { Career } from '../helpers/careerEnum';
import {CareersHelper} from '../helpers/careers';
import { ADVANCED_TEAM_DYNAMICS } from '../helpers/talents';
import {Button} from './button';
import { Header } from './header';
import { withTranslation, WithTranslation } from 'react-i18next';

interface ICareerSelectionProperties extends WithTranslation {
    onSelection: (career: Career) => void;
    onCancel: () => void;
}

class CareerSelection extends React.Component<ICareerSelectionProperties, {}> {
    render() {
        const { t } = this.props;

        let message = (character.hasTalent(ADVANCED_TEAM_DYNAMICS)) ? (<div className="page-text">{t('CareerSelectionPage.exclusionText')}</div>) : undefined;

        var careers = CareersHelper.instance.getCareers().map((c, i) => {
            const talent = c.talent.length === 1
                ? c.talent[0].name
                : t('CareerSelectionPage.selectOneTalent');

            return (
                <tr key={i}
                    onClick={() => { if (Window.isCompact()) this.props.onSelection(c.id); } }>
                    <td className="selection-header">{c.localizedName}</td>
                    <td>{talent}</td>
                    <td><Button className="button-small" text="Select" onClick={() => { this.props.onSelection(c.id) } } /></td>
                </tr>
            )
        });

        return (
            <div>
                <Header>{t('CareerSelectionPage.title')}</Header>
                {message}
                <table className="selection-list">
                    <thead>
                        <tr>
                            <td></td>
                            <td><b>{t('Construct.other.talent')}</b></td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {careers}
                    </tbody>
                </table>
                <Button text={t('Common.button.cancel')} className="button button-cancel" onClick={() => this.props.onCancel() }/>
            </div>
        );
    }
}

export default withTranslation()(CareerSelection);