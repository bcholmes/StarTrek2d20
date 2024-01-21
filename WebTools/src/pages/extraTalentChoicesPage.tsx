import * as React from 'react';
import { CheckBox } from '../components/checkBox';
import { Button } from '../components/button';
import { PageIdentity } from './pageIdentity';
import { Navigation } from '../common/navigator';
import CharacterCreationBreadcrumbs from '../components/characterCreationBreadcrumbs';
import { Header } from '../components/header';
import replaceDiceWithArrowhead from '../common/arrowhead';
import store from '../state/store';
import { addCharacterBorgImplant, addCharacterTalentFocus, addCharacterTalentValue, removeCharacterBorgImplant, setCharacterFocus } from '../state/characterActions';
import { BorgImplants, Implant } from '../helpers/borgImplant';
import { ICharacterProperties, characterMapStateToProperties } from '../solo/page/soloCharacterProperties';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { TALENT_NAME_BORG_IMPLANTS, TALENT_NAME_EXPANDED_PROGRAM, TALENT_NAME_VISIT_EVERY_STAR, TALENT_NAME_WISDOM_OF_YEARS } from '../helpers/talents';
import { InputFieldAndLabel } from '../common/inputFieldAndLabel';
import D20IconButton from '../solo/component/d20IconButton';
import { ValueRandomTable } from '../solo/table/valueRandomTable';
import { FocusRandomTable } from '../solo/table/focusRandomTable';

const ExtraTalentChoicesPage : React.FC<ICharacterProperties> = ({character}) => {

    const { t } = useTranslation();

    const selectImplant = (implant: Implant) => {
        if (character.implants.indexOf(implant.type) >= 0) {
            store.dispatch(removeCharacterBorgImplant(implant.type));
        } else {
            store.dispatch(addCharacterBorgImplant(implant.type));
        }
    }

    const onNext = () => {
        Navigation.navigateToPage(PageIdentity.Finish);
    }

    const selectRandomValue = (talent: string) => {
        let done = false;
        while (!done) {
            let value = ValueRandomTable(character.speciesStep?.species, character.educationStep?.primaryDiscipline);
            if (character.values.indexOf(value) < 0) {
                done = true;
                store.dispatch(addCharacterTalentValue(value, talent));
            }
        }
    }

    const selectRandomFocus = (talent: string, index: number) => {
        let done = false;
        while (!done) {
            let focus = FocusRandomTable(character.educationStep?.primaryDiscipline);
            if (character.focuses.indexOf(focus) < 0) {
                done = true;
                store.dispatch(addCharacterTalentFocus(focus, talent, index));
            }
        }
    }

    const renderImplants = () => {
        if (character.hasTalent(TALENT_NAME_BORG_IMPLANTS)) {
            const implants = BorgImplants.instance.implants.map((implant, i) => {
                return (
                    <tr>
                        <td>
                            <CheckBox
                                isChecked={character.implants.indexOf(implant.type) > -1}
                                onChanged={(val) => { selectImplant(implant); }}
                                value={implant.name} />
                        </td>
                        <td className="selection-header-small">{implant.name}</td>
                        <td>{replaceDiceWithArrowhead(implant.description)}</td>
                    </tr>
                );
            });

            return (
                <div className="col-lg-12 my-4">
                    <Header level={2}>Borg Implants</Header>
                    <p>
                        You have the talent "Borg Implants", which allows you to select up to 3 implants.
                        Each implant increases the difficulty of Medicine Tasks performed on you.
                    </p>
                    <table className="selection-list">
                        <tbody>
                            {implants}
                        </tbody>
                    </table>
                </div>
            )
        } else {
            return undefined;
        }
    }

    const selectValue = (value, talentName) => {
        store.dispatch(addCharacterTalentValue(value, talentName));
    }
    const addFocus = (focus, talentName, index) => {
        store.dispatch(addCharacterTalentFocus(focus, talentName, index));
    }

    const renderVisitEveryStar = () => {
        if (character.hasTalent(TALENT_NAME_VISIT_EVERY_STAR)) {
            let talent = character.getTalentByName(TALENT_NAME_VISIT_EVERY_STAR);
            return (<div className="mt-4 col-lg-6">
                    <Header level={2}>Visit Every Star</Header>
                    <p>Characters with the talent "Visit Every Star" may choose 1 additional focus.</p>
                    <InputFieldAndLabel id={'focus-star'}
                        labelName={t('Construct.other.focus')}
                        onChange={(value) => addFocus(value, TALENT_NAME_VISIT_EVERY_STAR, 0)}
                        value={talent.focuses[0] ?? ""}
                        key={'additionalFocus-star'} />
                    <div><small className="text-white">
                        <b>Suggestions: </b> {' '}  Astronavigation, Stellar Cartography, or a similar field of space science.
                    </small></div>
                </div>);
        } else {
            return undefined;
        }
    }

    const renderWisdomOfYears = () => {
        if (character.hasTalent(TALENT_NAME_WISDOM_OF_YEARS)) {
            let talent = character.getTalentByName(TALENT_NAME_WISDOM_OF_YEARS);
            return (<div className="mt-4 col-lg-6">
                    <Header level={2}>Visit Every Star</Header>
                    <p>Characters with the talent "Visit Every Star" may choose 1 additional focus.</p>
                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                        <InputFieldAndLabel id="wisdom-focus1" labelName={t('Construct.other.focus')}
                            value={talent?.focuses[0] || ""} className="mt-1"
                            onChange={(v) => addFocus(v, TALENT_NAME_WISDOM_OF_YEARS, 0)} />
                        <div style={{ flexShrink: 0 }} className="mt-1">
                            <D20IconButton onClick={() => selectRandomFocus(TALENT_NAME_WISDOM_OF_YEARS, 0)}/>
                        </div>
                    </div>
                    <div><small className="text-white">
                        Choose a focus reflecting the insights you received from your long life
                    </small></div>

                    <p className="mt-4">They may also choose 1 additional value.</p>
                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                        <InputFieldAndLabel id="wisdom-value" labelName={t('Construct.other.value')}
                            value={talent?.value || ""} className="mt-1"
                            onChange={(v) => selectValue(v, TALENT_NAME_WISDOM_OF_YEARS)} />
                        <div style={{ flexShrink: 0 }} className="mt-1">
                            <D20IconButton onClick={() => selectRandomValue(TALENT_NAME_WISDOM_OF_YEARS)}/>
                        </div>
                    </div>

                </div>);
        } else {
            return undefined;
        }
    }
    const renderExpandedProgram = () => {
        if (character.hasTalent(TALENT_NAME_EXPANDED_PROGRAM)) {
            let talent = character.getTalentByName(TALENT_NAME_EXPANDED_PROGRAM);
            return (<div className="mt-4 col-lg-6">
                    <Header level={2}>Expanded Program</Header>
                    <p>Characters with the talent "Expanded Program" may choose 2 additional focuses.</p>
                    <InputFieldAndLabel id={'focus-exp-1'}
                        labelName={t('Construct.other.focus1')}
                        onChange={(value) => addFocus(value, TALENT_NAME_EXPANDED_PROGRAM, 0)}
                        value={talent.focuses[0] ?? ""}
                        key={'additionalFocus-exp-1'} />
                    <InputFieldAndLabel id={'focus-exp-2'}
                        labelName={t('Construct.other.focus2')}
                        onChange={(value) => addFocus(value, TALENT_NAME_EXPANDED_PROGRAM, 1)}
                        value={talent.focuses[1] ?? ""}
                        key={'additionalFocus-exp-2'} />
                    <div><small className="text-white">
                        <b>Suggestions: </b> {' '} Holonovel writing, Opera, Holo-photography, or anything else
                    </small></div>
                </div>);
        } else {
            return undefined;
        }
    }

    return (<div className="page container ml-0">
            <CharacterCreationBreadcrumbs />
            <main>
                <Header>Additional Talent Details</Header>

                <p>Some of your talents require a few extra decisions.</p>

                <div className="row">
                    {renderImplants()}
                    {renderVisitEveryStar()}
                    {renderExpandedProgram()}
                    {renderWisdomOfYears()}
                </div>

                <div className="text-right my-4">
                    <Button buttonType={true} className="btn btn-primary" onClick={() => onNext()} >{t('Common.button.next')}</Button>
                </div>
            </main>
        </div>);
}

export default connect(characterMapStateToProperties)(ExtraTalentChoicesPage);